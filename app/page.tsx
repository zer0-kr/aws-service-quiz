"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LandingPage() {
  const supabase = createClient();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoginError(null);
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch {
      setLoginError("Failed to connect to Google. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grid flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="space-y-4 fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff9900] to-[#cc7a00] flex items-center justify-center glow-orange-strong">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold font-[family-name:var(--font-heading)] tracking-tight">
            <span className="text-white">AWS</span>{" "}
            <span className="text-[#ff9900] text-glow-orange">Quiz</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Can you identify AWS services by their icons?
            <br />
            <span className="text-gray-500">15 questions. Race the clock. Climb the ranks.</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 fade-in" style={{ animationDelay: "0.1s" }}>
          {[
            { icon: "\u26A1", label: "15 Questions" },
            { icon: "\u23F1\uFE0F", label: "Timed" },
            { icon: "\uD83C\uDFC6", label: "Leaderboard" },
          ].map((f) => (
            <div key={f.label} className="glass-card rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-xs text-gray-400">{f.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4 fade-in" style={{ animationDelay: "0.2s" }}>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-white text-gray-900 font-semibold px-6 py-4 hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {loading ? "Connecting..." : "Sign in with Google"}
          </button>
          {loginError && (
            <p className="text-sm text-red-400 text-center">{loginError}</p>
          )}
          <Link href="/leaderboard" className="block text-sm text-gray-500 hover:text-[#ff9900] transition-colors">
            View Leaderboard &rarr;
          </Link>
        </div>

        <p className="text-xs text-gray-600 fade-in" style={{ animationDelay: "0.3s" }}>
          100 AWS services &bull; 5 difficulty levels &bull; Daily challenge
        </p>
      </div>
    </div>
  );
}
