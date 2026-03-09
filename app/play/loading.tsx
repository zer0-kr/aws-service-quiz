export default function PlayLoading() {
  return (
    <div className="min-h-screen bg-grid px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-32 bg-[#1e1e2e] rounded-lg animate-pulse" />
            <div className="h-4 w-24 bg-[#1e1e2e] rounded animate-pulse" />
          </div>
          <div className="h-4 w-16 bg-[#1e1e2e] rounded animate-pulse" />
        </div>

        {/* Game card skeleton */}
        <div className="glass-card rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="h-9 w-48 mx-auto bg-[#1e1e2e] rounded-lg animate-pulse" />
            <div className="h-4 w-64 mx-auto bg-[#1e1e2e] rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0a0a0f] rounded-xl p-4 text-center">
                <div className="h-8 w-8 mx-auto bg-[#1e1e2e] rounded animate-pulse mb-1" />
                <div className="h-3 w-16 mx-auto bg-[#1e1e2e] rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="h-14 w-full bg-[#1e1e2e] rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
