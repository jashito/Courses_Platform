import { NextRequest, NextResponse } from "next/server";
import { getUserAndRole } from "@/lib/authServer";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

  const quizId = params.id;
  const body = await request.json();
  const { answers } = body;
  if (!answers || !Array.isArray(answers)) {
    return NextResponse.json({ error: "answers array required" }, { status: 400 });
  }

  const { data: questions, error: qErr } = await supabase
    .from("quiz_questions")
    .select("id, quiz_answers(id, is_correct)")
    .eq("quiz_id", quizId);

  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });

  let score = 0;
  const maxScore = questions?.length || 0;
  const correctMap = new Map<string, string>();

  questions?.forEach((q: unknown) => {
    const qObj = q as { id: string; quiz_answers?: { id: string; is_correct: boolean }[] };
    const correct = qObj.quiz_answers?.find((a) => a.is_correct);
    if (correct) correctMap.set(qObj.id, correct.id);
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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    attempt_id: data.id,
    score,
    max_score: maxScore,
    passed
  }, { status: 201 });
}
