"use client";

import { Settings, LogOut, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const userName = currentUser?.fullname || "User";
  const userEmail = currentUser?.email || "user@lumora.ai";
  
  const initials = currentUser?.fullname
    ? currentUser.fullname
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "US";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className="flex items-center gap-2.5 h-9 pl-1 pr-2.5 rounded-[12px] bg-[#131316]/60 border border-white/10 backdrop-blur-[20px] hover:border-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
            aria-label="User menu"
          >
            <Avatar className="h-7 w-7 border border-white/10">
              <AvatarFallback className="bg-[#4A00FF] text-white text-[11px] font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-foreground hidden sm:inline-block">
              {userName}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        }
      />

      <DropdownMenuContent
        align="end"
        className="w-56 overflow-hidden rounded-[16px] border border-white/10 bg-[#131316]/95 p-2 shadow-2xl backdrop-blur-[20px] outline-none"
      >
        {/* User Header */}
        <div className="px-3 py-2 border-b border-white/10 mb-1">
          <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
          <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
        </div>

        <DropdownMenuItem
          onClick={() => router.push("/settings")}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-foreground hover:bg-white/5 transition-colors focus-visible:bg-white/5 focus-visible:outline-none cursor-pointer"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span>Profile Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="border-t border-white/10 my-1" />

        <DropdownMenuItem
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors focus-visible:bg-red-500/10 focus-visible:outline-none cursor-pointer"
        >
          <LogOut className="h-4 w-4 text-red-400" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
