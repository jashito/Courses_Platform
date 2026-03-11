import { NextRequest, NextResponse } from "next/server";
import { getUserAndRole } from "@/lib/authServer";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const course_id = searchParams.get("course_id");
  let query = supabase.from("modules").select("*");
  if (course_id) query = query.eq("course_id", course_id);

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

  const { role } = await getUserAndRole();
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { course_id, title, position } = body;
  if (!course_id || !title) return NextResponse.json({ error: "course_id and title required" }, { status: 400 });

  const { data, error } = await supabase
    .from("modules")
    .insert({ course_id, title, position })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
