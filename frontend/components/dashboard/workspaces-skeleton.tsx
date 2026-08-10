"use client";

export function WorkspacesSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="space-y-3">
          <div className="h-8 w-48 rounded-md bg-white/10" />
          <div className="h-4 w-72 rounded-md bg-white/5" />
        </div>
        <div className="h-10 w-36 rounded-[12px] bg-white/10 shrink-0" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="mb-6 h-11 w-full rounded-[12px] bg-white/5 border border-white/5" />

      {/* Workspaces Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
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
  );
}
