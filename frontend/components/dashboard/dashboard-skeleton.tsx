"use client";

export function DashboardSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-3 w-full max-w-md">
          <div className="h-4 w-32 rounded-md bg-white/5" />
          <div className="h-8 w-64 md:w-80 rounded-md bg-white/10" />
          <div className="h-4 w-full rounded-md bg-white/5" />
        </div>
      </div>

      {/* Stats Grid Skeleton (Only 1 stat card for Total Workspaces) */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col h-[112px] rounded-[16px] bg-[#131316]/40 border border-white/5 p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="h-4 w-28 rounded-md bg-white/5" />
            <div className="h-8 w-8 rounded-[10px] bg-white/5" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="h-8 w-16 rounded-md bg-white/10" />
            <div className="h-3 w-20 rounded-md bg-white/5" />
          </div>
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="mb-8">
        <div className="h-5 w-32 rounded-md bg-white/5 mb-4" />
        <div className="flex gap-3 overflow-hidden">
          <div className="h-[46px] w-[160px] shrink-0 rounded-[12px] bg-white/5 border border-white/5" />
        </div>
      </div>

      {/* Recent Workspaces Skeleton */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-36 rounded-md bg-white/10" />
          <div className="h-4 w-16 rounded-md bg-white/5" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col h-[160px] rounded-[16px] bg-[#131316]/40 border border-white/5 p-5"
            >
              <div className="flex justify-between mb-3">
                <div className="h-10 w-10 rounded-[12px] bg-white/10" />
                <div className="h-8 w-8 rounded-full bg-white/5" />
              </div>
              <div className="h-5 w-3/4 rounded-md bg-white/10 mb-2" />
              <div className="h-3 w-full rounded-md bg-white/5 mb-1" />
              <div className="h-3 w-1/2 rounded-md bg-white/5 mb-4" />
              <div className="mt-auto pt-4 border-t border-white/5 flex justify-end">
                <div className="h-3 w-24 rounded-md bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
