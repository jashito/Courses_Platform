import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseServerClient } from "./supabaseServer";

export async function getUserAndRole(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getSupabaseServerClient(req, res);
  const { data: authData, error } = await supabase.auth.getUser();

  if (error || !authData?.user) return { user: null, role: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", authData.user.id)
    .single();

  return { user: authData.user, role: profile?.role ?? "student" };
}