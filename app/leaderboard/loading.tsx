export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen bg-grid px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-9 w-48 bg-[#1e1e2e] rounded-lg animate-pulse" />
            <div className="h-4 w-56 bg-[#1e1e2e] rounded animate-pulse" />
          </div>
          <div className="h-9 w-14 bg-[#1e1e2e] rounded-lg animate-pulse" />
        </div>

        {/* Rankings skeleton */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e2e] last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1e1e2e] animate-pulse" />
                <div className="h-4 w-24 bg-[#1e1e2e] rounded animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="h-5 w-16 bg-[#1e1e2e] rounded animate-pulse ml-auto" />
                <div className="h-3 w-12 bg-[#1e1e2e] rounded animate-pulse ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
