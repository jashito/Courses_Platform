import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getUserAndRole } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getSupabaseServerClient(req, res);
  const { user } = await getUserAndRole(req, res);

  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST" || req.method === "PUT") {
    const { lesson_id, status, percent } = req.body;
    if (!lesson_id) return res.status(400).json({ error: "lesson_id required" });

    const { data, error } = await supabase
      .from("progress")
      .upsert({ user_id: user.id, lesson_id, status, percent }, { onConflict: "user_id,lesson_id" })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "GET") {
    const { lesson_id } = req.query;
    let query = supabase.from("progress").select("*").eq("user_id", user.id);
    if (lesson_id) query = query.eq("lesson_id", lesson_id);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}