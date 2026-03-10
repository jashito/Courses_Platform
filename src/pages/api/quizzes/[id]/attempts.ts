import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getUserAndRole } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getSupabaseServerClient(req, res);
  const { user } = await getUserAndRole(req, res);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const quizId = req.query.id as string;

  if (req.method === "POST") {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "answers array required" });
    }

    const { data: questions, error: qErr } = await supabase
      .from("quiz_questions")
      .select("id, quiz_answers(id, is_correct)")
      .eq("quiz_id", quizId);

    if (qErr) return res.status(500).json({ error: qErr.message });

    let score = 0;
    const maxScore = questions?.length || 0;
    const correctMap = new Map<string, string>();

    questions?.forEach((q: any) => {
      const correct = q.quiz_answers?.find((a: any) => a.is_correct);
      if (correct) correctMap.set(q.id, correct.id);
    });

    answers.forEach((a: { question_id: string; answer_id: string }) => {
      if (correctMap.get(a.question_id) === a.answer_id) score += 1;
    });

    const passed = score >= Math.ceil(maxScore * 0.7);

    const { data, error } = await supabase
      .from("quiz_attempts")
      .insert({ quiz_id: quizId, user_id: user.id, score, max_score: maxScore, passed })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({
      attempt_id: data.id,
      score,
      max_score: maxScore,
      passed
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}