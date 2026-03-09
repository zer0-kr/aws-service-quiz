"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatTime, PENALTY_MS, TOTAL_QUESTIONS } from "@/lib/utils";

function ResultContent() {
  const searchParams = useSearchParams();
  const time = parseInt(searchParams.get("time") || "0");
  const penalties = parseInt(searchParams.get("penalties") || "0");
  const correctCount = parseInt(searchParams.get("correct") || String(TOTAL_QUESTIONS - penalties));
  const finalTime = parseInt(searchParams.get("final") || "0");
  const penaltyMs = penalties * PENALTY_MS;
  const isPerfect = penalties === 0;

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 fade-in">
        {/* Result Header */}
        <div className="text-center space-y-4">
          <div className="text-6xl">{isPerfect ? "\uD83C\uDF1F" : "\uD83C\uDFC1"}</div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)]">
            {isPerfect ? "Perfect Run!" : "Quiz Complete!"}
          </h1>
        </div>

        {/* Score Card */}
        <div className="glass-card rounded-2xl p-8 space-y-6">
          {/* Final Time */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Final Time</p>
            <div className="font-mono text-5xl font-bold text-[#ff9900] text-glow-orange">
              {formatTime(finalTime)}
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0a0a0f] rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Base Time</p>
              <p className="font-mono font-bold text-lg">{formatTime(time)}</p>
            </div>
            <div className="bg-[#0a0a0f] rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Penalties</p>
              <p className={`font-mono font-bold text-lg ${penalties > 0 ? "text-red-400" : "text-green-400"}`}>
                {penalties > 0 ? `+${formatTime(penaltyMs)}` : "None"}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-green-400">{correctCount}</p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="w-px bg-[#1e1e2e]" />
            <div>
              <p className="text-2xl font-bold text-red-400">{penalties}</p>
              <p className="text-xs text-gray-500">Wrong</p>
            </div>
            <div className="w-px bg-[#1e1e2e]" />
            <div>
              <p className="text-2xl font-bold">{isPerfect ? "\u2B50" : "\uD83D\uDCAA"}</p>
              <p className="text-xs text-gray-500">{isPerfect ? "Perfect" : "Good Try"}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/play"
            className="block w-full py-4 rounded-xl bg-gradient-to-r from-[#ff9900] to-[#cc7a00] text-white font-bold text-lg text-center hover:from-[#ffad33] hover:to-[#ff9900] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] glow-orange"
          >
            Play Again
          </Link>
          <Link
            href="/leaderboard"
            className="block w-full py-4 rounded-xl border border-[#1e1e2e] text-gray-400 font-medium text-center hover:border-[#ff9900]/30 hover:text-[#ff9900] transition-all duration-200"
          >
            View Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#ff9900] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
