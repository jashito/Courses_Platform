-- Courses Platform schema + RLS + triggers (Supabase/Postgres)

-- Extensions
create extension if not exists "pgcrypto";

-- Tables
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student',
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  is_published boolean not null default false,
  created_by uuid not null references public.profiles(user_id),
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  position int not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  content text,
  video_url text,
  position int not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  resource_type text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  is_required boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_text text not null,
  position int not null default 1
);

create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  answer_text text not null,
  is_correct boolean not null default false
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  score int,
  max_score int,
  passed boolean not null default false,
  submitted_at timestamptz not null default now()
);

create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status text not null default 'in_progress',
  percent int not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

-- Helper function for admin role
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = uid and p.role = 'admin'
  );
$$;

-- Trigger: create profile on new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
as $$
begin
  insert into public.profiles (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.resources enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.progress enable row level security;

-- Profiles policies
create policy if not exists profiles_select_own
on public.profiles for select
using (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy if not exists profiles_update_own
on public.profiles for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Courses policies
create policy if not exists courses_select_published
on public.courses for select
using (is_published = true or public.is_admin(auth.uid()));

create policy if not exists courses_admin_write
on public.courses for insert
with check (public.is_admin(auth.uid()));

create policy if not exists courses_admin_update
on public.courses for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy if not exists courses_admin_delete
on public.courses for delete
using (public.is_admin(auth.uid()));

-- Modules policies (visible if parent course published)
create policy if not exists modules_select_published
on public.modules for select
using (
  public.is_admin(auth.uid()) or
  exists (select 1 from public.courses c where c.id = course_id and c.is_published = true)
);

create policy if not exists modules_admin_write
on public.modules for insert
with check (public.is_admin(auth.uid()));

create policy if not exists modules_admin_update
on public.modules for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy if not exists modules_admin_delete
on public.modules for delete
using (public.is_admin(auth.uid()));

-- Lessons policies (visible if parent course published)
create policy if not exists lessons_select_published
on public.lessons for select
using (
  public.is_admin(auth.uid()) or
  exists (
    select 1 from public.modules m
    join public.courses c on c.id = m.course_id
    where m.id = module_id and c.is_published = true
  )
);

create policy if not exists lessons_admin_write
on public.lessons for insert
with check (public.is_admin(auth.uid()));

create policy if not exists lessons_admin_update
on public.lessons for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy if not exists lessons_admin_delete
on public.lessons for delete
using (public.is_admin(auth.uid()));

-- Resources policies (visible if parent course published)
create policy if not exists resources_select_published
on public.resources for select
using (
  public.is_admin(auth.uid()) or
  exists (
    select 1 from public.lessons l
    join public.modules m on m.id = l.module_id
    join public.courses c on c.id = m.course_id
    where l.id = lesson_id and c.is_published = true
  )
);

create policy if not exists resources_admin_write
on public.resources for insert
with check (public.is_admin(auth.uid()));

create policy if not exists resources_admin_update
on public.resources for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy if not exists resources_admin_delete
on public.resources for delete
using (public.is_admin(auth.uid()));

-- Quizzes policies (visible if parent course published)
create policy if not exists quizzes_select_published
on public.quizzes for select
using (
  public.is_admin(auth.uid()) or
  exists (
    select 1 from public.lessons l
    join public.modules m on m.id = l.module_id
    join public.courses c on c.id = m.course_id
    where l.id = lesson_id and c.is_published = true
  )
);

create policy if not exists quizzes_admin_write
on public.quizzes for insert
with check (public.is_admin(auth.uid()));

create policy if not exists quizzes_admin_update
on public.quizzes for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy if not exists quizzes_admin_delete
on public.quizzes for delete
using (public.is_admin(auth.uid()));

-- Quiz questions policies
create policy if not exists quiz_questions_select_published
on public.quiz_questions for select
using (
  public.is_admin(auth.uid()) or
  exists (
    select 1 from public.quizzes q
    join public.lessons l on l.id = q.lesson_id
    join public.modules m on m.id = l.module_id
    join public.courses c on c.id = m.course_id
    where q.id = quiz_id and c.is_published = true
  )
);

create policy if not exists quiz_questions_admin_write
on public.quiz_questions for insert
with check (public.is_admin(auth.uid()));

create policy if not exists quiz_questions_admin_update
on public.quiz_questions for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy if not exists quiz_questions_admin_delete
on public.quiz_questions for delete
using (public.is_admin(auth.uid()));

-- Quiz answers policies
create policy if not exists quiz_answers_select_published
on public.quiz_answers for select
using (
  public.is_admin(auth.uid()) or
  exists (
    select 1 from public.quiz_questions qq
    join public.quizzes q on q.id = qq.quiz_id
    join public.lessons l on l.id = q.lesson_id
    join public.modules m on m.id = l.module_id
    join public.courses c on c.id = m.course_id
    where qq.id = question_id and c.is_published = true
  )
);

create policy if not exists quiz_answers_admin_write
on public.quiz_answers for insert
with check (public.is_admin(auth.uid()));

create policy if not exists quiz_answers_admin_update
on public.quiz_answers for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy if not exists quiz_answers_admin_delete
on public.quiz_answers for delete
using (public.is_admin(auth.uid()));

-- Progress policies
create policy if not exists progress_select_own
on public.progress for select
using (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy if not exists progress_insert_own
on public.progress for insert
with check (user_id = auth.uid());

create policy if not exists progress_update_own
on public.progress for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Quiz attempts policies
create policy if not exists quiz_attempts_select_own
on public.quiz_attempts for select
using (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy if not exists quiz_attempts_insert_own
on public.quiz_attempts for insert
with check (user_id = auth.uid());
