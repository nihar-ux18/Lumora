"use client";

export function DashboardSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8 flex flex-col gap-3">
        <div className="h-4 w-32 rounded-md bg-white/5" />
        <div className="h-8 w-64 rounded-md bg-white/10" />
        <div className="h-4 w-96 rounded-md bg-white/5" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(1)].map((_, i) => (
          <div
            key={i}
            className="h-[120px] rounded-[16px] bg-[#131316]/40 border border-white/5 p-5"
          >
            <div className="flex justify-between mb-4">
              <div className="h-4 w-24 rounded-md bg-white/5" />
              <div className="h-8 w-8 rounded-[10px] bg-white/5" />
            </div>
            <div className="h-8 w-16 rounded-md bg-white/10 mb-2" />
            <div className="h-3 w-32 rounded-md bg-white/5" />
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="mb-8">
        <div className="h-5 w-32 rounded-md bg-white/5 mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-40 shrink-0 rounded-[12px] bg-white/5 border border-white/5"
            />
          ))}
        </div>
      </div>

      {/* Main Content Split Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-5 w-40 rounded-md bg-white/5 mb-2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-[16px] bg-[#131316]/40 border border-white/5"
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="h-5 w-32 rounded-md bg-white/5 mb-6" />
          <div className="h-[400px] rounded-[16px] bg-[#131316]/40 border border-white/5 p-6 space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-white/5" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 rounded-md bg-white/10" />
                  <div className="h-3 w-full rounded-md bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
