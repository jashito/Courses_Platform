import { NextRequest, NextResponse } from "next/server";
import { getUserAndRole } from "@/lib/authServer";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(_request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: unknown }[]) {
          cookiesToSet.forEach(({ name, value }) => cookieStore.set(name, value));
        },
      },
    }
  );

  const { user } = await getUserAndRole();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(_request.url);
  const lesson_id = searchParams.get("lesson_id");
  let query = supabase.from("progress").select("*").eq("user_id", user.id);
  if (lesson_id) query = query.eq("lesson_id", lesson_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: unknown }[]) {
          cookiesToSet.forEach(({ name, value }) => cookieStore.set(name, value));
        },
      },
    }
  );

  const { user } = await getUserAndRole();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { lesson_id, status, percent } = body;
  if (!lesson_id) return NextResponse.json({ error: "lesson_id required" }, { status: 400 });

  const { data, error } = await supabase
    .from("progress")
    .upsert({ user_id: user.id, lesson_id, status, percent }, { onConflict: "user_id,lesson_id" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
