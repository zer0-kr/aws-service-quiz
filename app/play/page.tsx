"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { startGame, getDailyAttempts, getMyRecords } from "@/app/actions/game";
import { signOut } from "@/app/actions/auth";
import { formatTime } from "@/lib/utils";

interface GameRecord {
  id: string;
  final_time_ms: number;
  penalty_count: number;
  correct_count: number;
  completed_at: string;
}

export default function PlayPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", user.id)
        .single();

      if (profile) setNickname(profile.nickname);

      const attemptsData = await getDailyAttempts();
      setAttempts(attemptsData.attempts);
      setMaxAttempts(attemptsData.max);

      const recordsData = await getMyRecords();
      setRecords(recordsData.records as GameRecord[]);
    }
    loadData();
  }, []);

  const handleStartGame = async () => {
    setLoading(true);
    setError(null);
    const result = await startGame();

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result.session) {
      router.push(`/play/game?id=${result.session.id}`);
    }
  };

  const remainingAttempts = maxAttempts - attempts;

  return (
    <div className="min-h-screen bg-grid px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between fade-in">
          <div>
            <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
              <span className="text-[#ff9900]">AWS</span> Quiz
            </h1>
            <p className="text-sm text-gray-400">Welcome, {nickname}</p>
          </div>
          <form action={signOut}>
            <button type="submit" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Sign Out
            </button>
          </form>
        </div>

        {/* Game Card */}
        <div className="glass-card rounded-2xl p-8 space-y-6 fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-heading)]">
              Ready to Play?
            </h2>
            <p className="text-gray-400">
              Identify 15 AWS service icons as fast as you can.
              <br />
              Wrong answers add +5s penalty to your time.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-[#0a0a0f] rounded-xl p-4">
              <div className="text-2xl font-bold text-[#ff9900]">{remainingAttempts}</div>
              <div className="text-xs text-gray-500">Attempts Left</div>
            </div>
            <div className="bg-[#0a0a0f] rounded-xl p-4">
              <div className="text-2xl font-bold">15</div>
              <div className="text-xs text-gray-500">Questions</div>
            </div>
            <div className="bg-[#0a0a0f] rounded-xl p-4">
              <div className="text-2xl font-bold">+5s</div>
              <div className="text-xs text-gray-500">Penalty</div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleStartGame}
            disabled={loading || remainingAttempts <= 0}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff9900] to-[#cc7a00] text-white font-bold text-lg hover:from-[#ffad33] hover:to-[#ff9900] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] glow-orange"
          >
            {loading ? "Starting..." : remainingAttempts <= 0 ? "No Attempts Left Today" : "Start Game"}
          </button>
        </div>

        {/* My Records */}
        {records.length > 0 && (
          <div className="glass-card rounded-2xl p-6 space-y-4 fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-lg font-bold font-[family-name:var(--font-heading)]">My Best Records</h3>
            <div className="space-y-2">
              {records.slice(0, 5).map((record, idx) => (
                <div key={record.id} className="flex items-center justify-between bg-[#0a0a0f] rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-6">#{idx + 1}</span>
                    <span className="font-mono font-bold text-[#ff9900]">{formatTime(record.final_time_ms)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{record.penalty_count > 0 ? `${record.penalty_count} penalties` : "Perfect!"}</span>
                    <span className="text-gray-600">{new Date(record.completed_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-4 fade-in" style={{ animationDelay: "0.3s" }}>
          <Link
            href="/leaderboard"
            className="px-6 py-3 rounded-xl border border-[#1e1e2e] hover:border-[#ff9900]/30 text-gray-400 hover:text-[#ff9900] transition-all duration-200"
          >
            &#x1F3C6; Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}
