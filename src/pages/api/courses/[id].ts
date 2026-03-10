import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getUserAndRole } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getSupabaseServerClient(req, res);
  const { id } = req.query;

  if (req.method === "GET") {
    const { role } = await getUserAndRole(req, res);
    let query = supabase
      .from("courses")
      .select("*, modules(*, lessons(*))")
      .eq("id", id)
      .single();

    if (role !== "admin") query = query.eq("is_published", true);

    const { data, error } = await query;
    if (error) return res.status(404).json({ error: "Course not found" });

    return res.status(200).json(data);
  }

  if (req.method === "PUT") {
    const { role } = await getUserAndRole(req, res);
    if (role !== "admin") return res.status(403).json({ error: "Forbidden" });

    const { title, description, is_published } = req.body;
    const { data, error } = await supabase
      .from("courses")
      .update({ title, description, is_published })
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { role } = await getUserAndRole(req, res);
    if (role !== "admin") return res.status(403).json({ error: "Forbidden" });

    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });

    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}