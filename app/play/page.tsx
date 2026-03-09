import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { MAX_DAILY_ATTEMPTS } from "@/lib/utils";
import PlayClient from "./play-client";

export default async function PlayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  // Parallel fetch: profile, daily attempts, records — single getUser, 3 parallel queries
  const admin = createAdminClient();

  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstNow = new Date(now.getTime() + kstOffset);
  const kstDateStr = kstNow.toISOString().split("T")[0];
  const kstMidnightStart = new Date(`${kstDateStr}T00:00:00+09:00`);
  const kstMidnightEnd = new Date(`${kstDateStr}T23:59:59.999+09:00`);

  const [profileResult, attemptsResult, recordsResult] = await Promise.all([
    supabase.from("profiles").select("nickname").eq("id", user.id).single(),
    admin
      .from("game_sessions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("started_at", kstMidnightStart.toISOString())
      .lte("started_at", kstMidnightEnd.toISOString()),
    supabase
      .from("game_sessions")
      .select("id, final_time_ms, penalty_count, correct_count, completed_at")
      .eq("status", "completed")
      .order("final_time_ms", { ascending: true })
      .limit(5),
  ]);

  if (!profileResult.data) redirect("/setup");

  return (
    <PlayClient
      nickname={profileResult.data.nickname}
      attempts={attemptsResult.count || 0}
      maxAttempts={MAX_DAILY_ATTEMPTS}
      records={recordsResult.data || []}
    />
  );
}
