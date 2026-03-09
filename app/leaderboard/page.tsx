import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatTime, formatRank } from "@/lib/utils";
import Link from "next/link";
import { LeaderboardEntry } from "@/types";
export const revalidate = 30;

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  // Use admin client for leaderboard query to bypass RLS
  // (game_sessions RLS requires auth.uid() = user_id, which blocks anon users)
  const { data: rankings } = await admin
    .from("leaderboard")
    .select("*")
    .order("rank", { ascending: true })
    .limit(50);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRank: LeaderboardEntry | null = null;
  if (user && rankings) {
    userRank = (rankings as LeaderboardEntry[]).find(
      (r) => r.user_id === user.id
    ) || null;
  }

  return (
    <div className="min-h-screen bg-grid px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between fade-in">
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)]">
              &#x1F3C6; Leaderboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Fastest AWS experts ranked by best time
            </p>
          </div>
          <Link
            href={user ? "/play" : "/"}
            className="px-4 py-2 rounded-lg border border-[#1e1e2e] text-sm text-gray-400 hover:border-[#ff9900]/30 hover:text-[#ff9900] transition-all"
          >
            {user ? "Play" : "Home"}
          </Link>
        </div>

        {/* User's Rank */}
        {userRank && (
          <div className="glass-card rounded-2xl p-4 glow-orange fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rank-badge text-xl w-10 h-10 bg-[#ff9900]/20 text-[#ff9900]">
                  {formatRank(userRank.rank)}
                </div>
                <div>
                  <p className="font-bold">{userRank.nickname}</p>
                  <p className="text-xs text-gray-400">Your best</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-[#ff9900] text-lg">
                  {formatTime(userRank.best_time_ms)}
                </p>
                <p className="text-xs text-gray-500">
                  {userRank.penalty_count > 0
                    ? `${userRank.penalty_count} penalties`
                    : "Perfect run"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rankings Table */}
        <div className="glass-card rounded-2xl overflow-hidden fade-in" style={{ animationDelay: "0.1s" }}>
          {!rankings || rankings.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-4xl mb-3">&#x1F3AE;</p>
              <p>No scores yet. Be the first to play!</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1e1e2e]">
              {(rankings as LeaderboardEntry[]).map((entry) => {
                const isTopThree = entry.rank <= 3;
                const isUser = user && entry.user_id === user.id;

                return (
                  <div
                    key={entry.user_id}
                    className={`flex items-center justify-between px-6 py-4 transition-colors ${
                      isUser
                        ? "bg-[#ff9900]/5"
                        : "hover:bg-[#12121a]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rank-badge text-sm w-8 h-8 ${
                          isTopThree
                            ? "bg-[#ff9900]/20 text-[#ff9900]"
                            : "bg-[#1e1e2e] text-gray-500"
                        }`}
                      >
                        {formatRank(entry.rank)}
                      </div>
                      {entry.avatar_url && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={entry.avatar_url}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <p className={`font-medium ${isUser ? "text-[#ff9900]" : ""}`}>
                          {entry.nickname}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-mono font-bold ${isTopThree ? "text-[#ff9900]" : "text-gray-300"}`}>
                        {formatTime(entry.best_time_ms)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {entry.penalty_count > 0
                          ? `${entry.penalty_count} penalties`
                          : "Perfect"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 fade-in">
          Showing best time per player &bull; Refreshes every 30 seconds
        </p>
      </div>
    </div>
  );
}
