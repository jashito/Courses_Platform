import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getUserAndRole } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getSupabaseServerClient(req, res);

  if (req.method === "GET") {
    const { course_id } = req.query;
    let query = supabase.from("modules").select("*");
    if (course_id) query = query.eq("course_id", course_id);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { role } = await getUserAndRole(req, res);
    if (role !== "admin") return res.status(403).json({ error: "Forbidden" });

    const { course_id, title, position } = req.body;
    if (!course_id || !title) return res.status(400).json({ error: "course_id and title required" });

    const { data, error } = await supabase
      .from("modules")
      .insert({ course_id, title, position })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}