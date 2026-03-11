import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export type UserRole = "admin" | "instructor" | "student";

export async function getUserAndRole() {
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

  const { data: authData, error } = await supabase.auth.getUser();

  if (error || !authData?.user) return { user: null, role: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", authData.user.id)
    .single();

  return { user: authData.user, role: (profile?.role ?? "student") as UserRole };
}
