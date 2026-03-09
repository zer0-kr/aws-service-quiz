"use client";

import { useState } from "react";
import { setNickname } from "@/app/actions/auth";

export default function SetupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await setNickname(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 fade-in">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#ff9900] to-[#cc7a00] flex items-center justify-center glow-orange">
            <span className="text-2xl">&#x1F3AE;</span>
          </div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)]">
            Set Your Nickname
          </h1>
          <p className="text-gray-400">
            Choose a name for the leaderboard. You can&apos;t change this later!
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="nickname"
              placeholder="Enter nickname (2-20 chars)"
              minLength={2}
              maxLength={20}
              required
              className="w-full px-5 py-4 rounded-xl bg-[#12121a] border border-[#1e1e2e] text-white placeholder-gray-500 focus:outline-none focus:border-[#ff9900]/50 focus:ring-1 focus:ring-[#ff9900]/30 transition-all text-lg"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <span>&#x26A0;</span> {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff9900] to-[#cc7a00] text-white font-bold text-lg hover:from-[#ffad33] hover:to-[#ff9900] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] glow-orange"
          >
            {loading ? "Saving..." : "Start Playing"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-600">
          Nickname will be visible on the public leaderboard
        </p>
      </div>
    </div>
  );
}
