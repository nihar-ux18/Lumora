"use client";

import { useState } from "react";
import { Settings, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 h-9 pl-1 pr-2.5 rounded-[12px] bg-[#131316]/60 border border-white/10 backdrop-blur-[20px] hover:border-white/20 transition-colors focus:outline-none"
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
      </motion.button>

      {/* User Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 mt-2 z-50 w-56 overflow-hidden rounded-[16px] border border-white/10 bg-[#131316]/95 p-2 shadow-2xl backdrop-blur-[20px]"
            >
              {/* User Header */}
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
                <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
              </div>

              {/* Menu Actions */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/settings");
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-foreground hover:bg-white/5 transition-colors"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Profile Settings</span>
              </button>

              <div className="border-t border-white/10 my-1" />

              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4 text-red-400" />
                <span>Sign Out</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
