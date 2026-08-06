"use client";

export function ActivityFeed() {
  return (
    <div className="rounded-[16px] bg-[#131316]/60 border border-white/10 p-6 backdrop-blur-[20px] h-full flex flex-col">
      <h2 className="text-sm font-semibold tracking-wide text-foreground mb-6">Recent Activity</h2>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 py-10">
        <p className="text-xs text-muted-foreground mb-2">No recent activity</p>
        <p className="text-[10px] text-muted-foreground max-w-[200px]">
          Activities like workspace creation, file uploads, and AI chats will appear here.
        </p>
      </div>
      {/* TODO: Integrate real activity feed from backend once endpoint exists */}
    </div>
  );
}
