import type { NextApiRequest, NextApiResponse } from "next";
import { getUserAndRole } from "./auth";

export async function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const { user, role } = await getUserAndRole(req, res);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return { ok: false };
  }
  if (role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return { ok: false };
  }
  return { ok: true, user };
}