"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateQuestions } from "@/lib/game/questions";
import { MAX_DAILY_ATTEMPTS } from "@/lib/utils";

export async function startGame() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const admin = createAdminClient();

  // Get today's KST boundaries
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstNow = new Date(now.getTime() + kstOffset);
  const kstDateStr = kstNow.toISOString().split("T")[0];
  const kstMidnightStart = new Date(`${kstDateStr}T00:00:00+09:00`);
  const kstMidnightEnd = new Date(`${kstDateStr}T23:59:59.999+09:00`);

  // Parallel: check daily limit + abandon old sessions + generate questions (CPU-only)
  const [attemptsResult, , questions] = await Promise.all([
    admin
      .from("game_sessions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("started_at", kstMidnightStart.toISOString())
      .lte("started_at", kstMidnightEnd.toISOString()),
    admin
      .from("game_sessions")
      .update({ status: "abandoned" })
      .eq("user_id", user.id)
      .eq("status", "playing"),
    Promise.resolve(generateQuestions()),
  ]);

  if (attemptsResult.count !== null && attemptsResult.count >= MAX_DAILY_ATTEMPTS) {
    return { error: "Daily attempt limit reached (3/3)" };
  }

  // Insert game session
  const { data: session, error } = await admin
    .from("game_sessions")
    .insert({
      user_id: user.id,
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

  return { session };
}

export async function completeGame(
  sessionId: string,
  answers: number[]
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const admin = createAdminClient();

  // Get the session
  const { data: session } = await admin
    .from("game_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .eq("status", "playing")
    .single();

  if (!session) {
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
  const penaltyMs = penaltyCount * 5000;
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
    .eq("status", "completed")
    .order("final_time_ms", { ascending: true })
    .limit(10);

  return { records: data || [] };
}
