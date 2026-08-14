"use client";

import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

interface NotificationButtonProps {
  hasUnread?: boolean;
  unreadCount?: number;
}

export function NotificationButton({
  hasUnread = true,
  unreadCount = 3,
}: NotificationButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className="relative flex items-center justify-center h-9 w-9 rounded-[12px] bg-[#131316]/60 border border-white/10 backdrop-blur-[20px] text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />

            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4A00FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4A00FF]" />
              </span>
            )}
          </button>
        }
      />

      {/* Notifications Popover Dropdown */}
      <DropdownMenuContent
        align="end"
        className="w-80 max-w-xs overflow-hidden rounded-[16px] border border-white/10 bg-[#131316]/95 p-4 shadow-2xl backdrop-blur-[20px] outline-none"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h4 className="text-xs font-semibold text-foreground">Notifications</h4>
          {hasUnread && (
            <span className="rounded-full bg-[#4A00FF]/20 px-2 py-0.5 text-[10px] font-medium text-[#4A00FF]">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="mt-3 space-y-2 text-xs text-muted-foreground">
          <div
            className="rounded-lg bg-white/5 p-2.5 hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
            tabIndex={0}
            role="button"
            aria-label="Notification: Workspace updated. Alex added 3 documents to Engineering Specs. 10 minutes ago"
          >
            <p className="font-medium text-foreground">Workspace updated</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Alex added 3 documents to &quot;Engineering Specs&quot;
            </p>
            <span className="text-[10px] text-zinc-500 mt-1 block">10m ago</span>
          </div>
          <div
            className="rounded-lg bg-white/5 p-2.5 hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
            tabIndex={0}
            role="button"
            aria-label="Notification: AI Quiz ready. Your practice quiz on Machine Learning has been generated. 1 hour ago"
          >
            <p className="font-medium text-foreground">AI Quiz ready</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Your practice quiz on Machine Learning has been generated.
            </p>
            <span className="text-[10px] text-zinc-500 mt-1 block">1h ago</span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
