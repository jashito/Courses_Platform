import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getUserAndRole } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getSupabaseServerClient(req, res);

  if (req.method === "GET") {
    const { role } = await getUserAndRole(req, res);
    const isAdmin = role === "admin";

    const query = supabase.from("courses").select("*");
    if (!isAdmin) query.eq("is_published", true);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { user, role } = await getUserAndRole(req, res);
    if (role !== "admin") return res.status(403).json({ error: "Forbidden" });

    const { title, description, is_published } = req.body;
    if (!title) return res.status(400).json({ error: "title is required" });

    const { data, error } = await supabase
      .from("courses")
      .insert({ title, description, is_published, created_by: user!.id })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}