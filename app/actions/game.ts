"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateQuestions } from "@/lib/game/questions";
import { MAX_DAILY_ATTEMPTS, TOTAL_QUESTIONS, PENALTY_MS } from "@/lib/utils";

export async function startGame() {
  const supabase = await createClient();

  // getSession() reads JWT from cookie — no network call. Gives us user.id instantly.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  const userId = session.user.id;
  const admin = createAdminClient();

  // Get today's KST boundaries
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstNow = new Date(now.getTime() + kstOffset);
  const kstDateStr = kstNow.toISOString().split("T")[0];
  const kstMidnightStart = new Date(`${kstDateStr}T00:00:00+09:00`);
  const kstMidnightEnd = new Date(`${kstDateStr}T23:59:59.999+09:00`);

  // ALL queries in parallel: verify token + check daily limit + abandon old + generate questions
  const [userResult, attemptsResult, , questions] = await Promise.all([
    supabase.auth.getUser(), // Verify token with auth server
    admin
      .from("game_sessions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("started_at", kstMidnightStart.toISOString())
      .lte("started_at", kstMidnightEnd.toISOString()),
    admin
      .from("game_sessions")
      .update({ status: "abandoned" })
      .eq("user_id", userId)
      .eq("status", "playing"),
    Promise.resolve(generateQuestions()),
  ]);

  // Verify token is valid
  if (!userResult.data.user) {
    return { error: "Not authenticated" };
  }

  if (attemptsResult.count !== null && attemptsResult.count >= MAX_DAILY_ATTEMPTS) {
    return { error: "Daily attempt limit reached (3/3)" };
  }

  // Insert game session
  const { data: gameSession, error } = await admin
    .from("game_sessions")
    .insert({
      user_id: userId,
      questions,
      status: "playing",
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    if (error.message?.includes("Daily attempt limit")) {
      return { error: "Daily attempt limit reached (3/3)" };
    }
    return { error: "Failed to create game session" };
  }

  return { session: gameSession };
}

export async function getGameQuestions(sessionId: string) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  const admin = createAdminClient();
  const { data: gameSession } = await admin
    .from("game_sessions")
    .select("questions, user_id, status")
    .eq("id", sessionId)
    .single();

  if (!gameSession || gameSession.user_id !== session.user.id || gameSession.status !== "playing") {
    return { error: "Game session not found" };
  }

  // Strip correctIndex — client must never see answers
  const safeQuestions = (gameSession.questions as { serviceId: string; iconUrl: string; choices: string[] }[]).map((q) => ({
    serviceId: q.serviceId,
    iconUrl: q.iconUrl,
    choices: q.choices,
  }));

  return { questions: safeQuestions };
}

export async function checkAnswer(
  sessionId: string,
  questionIndex: number,
  choiceIndex: number
) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  if (
    typeof questionIndex !== "number" ||
    questionIndex < 0 ||
    questionIndex >= TOTAL_QUESTIONS ||
    typeof choiceIndex !== "number" ||
    choiceIndex < 0 ||
    choiceIndex > 3
  ) {
    return { error: "Invalid input" };
  }

  const admin = createAdminClient();
  const { data: gameSession } = await admin
    .from("game_sessions")
    .select("questions, user_id, status")
    .eq("id", sessionId)
    .single();

  if (!gameSession || gameSession.user_id !== session.user.id || gameSession.status !== "playing") {
    return { error: "Game session not found" };
  }

  const questions = gameSession.questions as { correctIndex: number }[];
  const correct = choiceIndex === questions[questionIndex].correctIndex;

  return { correct, correctIndex: questions[questionIndex].correctIndex };
}

export async function completeGame(
  sessionId: string,
  answers: number[]
) {
  // Validate answers array
  if (
    !Array.isArray(answers) ||
    answers.length !== TOTAL_QUESTIONS ||
    !answers.every((a) => typeof a === "number" && Number.isInteger(a) && a >= 0 && a <= 3)
  ) {
    return { error: "Invalid answers" };
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  // Parallel: auth check + session fetch (admin bypasses RLS, validate ownership after)
  const [userResult, sessionResult] = await Promise.all([
    supabase.auth.getUser(),
    admin
      .from("game_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("status", "playing")
      .single(),
  ]);

  const user = userResult.data.user;
  if (!user) {
    return { error: "Not authenticated" };
  }

  const session = sessionResult.data;
  if (!session || session.user_id !== user.id) {
    return { error: "Game session not found or already completed" };
  }

  // Server-side answer validation
  const questions = session.questions as { correctIndex: number }[];
  let penaltyCount = 0;
  let correctCount = 0;

  for (let i = 0; i < questions.length; i++) {
    if (answers[i] === questions[i].correctIndex) {
      correctCount++;
    } else {
      penaltyCount++;
    }
  }

  const completedAt = new Date();
  const startedAt = new Date(session.started_at);
  const totalTimeMs = completedAt.getTime() - startedAt.getTime();
  const penaltyMs = penaltyCount * PENALTY_MS;
  const finalTimeMs = totalTimeMs + penaltyMs;

  const { data: updated, error } = await admin
    .from("game_sessions")
    .update({
      completed_at: completedAt.toISOString(),
      total_time_ms: totalTimeMs,
      penalty_ms: penaltyMs,
      final_time_ms: finalTimeMs,
      penalty_count: penaltyCount,
      correct_count: correctCount,
      status: "completed",
    })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) {
    return { error: "Failed to complete game" };
  }

  return { session: updated };
}

export async function getDailyAttempts() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { attempts: 0, max: MAX_DAILY_ATTEMPTS };
  }

  const admin = createAdminClient();

  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstNow = new Date(now.getTime() + kstOffset);
  const kstDateStr = kstNow.toISOString().split("T")[0];

  const kstMidnightStart = new Date(`${kstDateStr}T00:00:00+09:00`);
  const kstMidnightEnd = new Date(`${kstDateStr}T23:59:59.999+09:00`);

  const { count } = await admin
    .from("game_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("started_at", kstMidnightStart.toISOString())
    .lte("started_at", kstMidnightEnd.toISOString());

  return { attempts: count || 0, max: MAX_DAILY_ATTEMPTS };
}

export async function getMyRecords() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { records: [] };
  }

  const { data } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("final_time_ms", { ascending: true })
    .limit(10);

  return { records: data || [] };
}
