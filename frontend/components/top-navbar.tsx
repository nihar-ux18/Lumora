"use client";

import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { SearchBar } from "./search-bar";
import { NotificationButton } from "./notification-button";
import { UserMenu } from "./user-menu";

interface TopNavbarProps {
  onOpenCommandMenu?: () => void;
  onOpenMobileMenu?: () => void;
}

export function TopNavbar({ onOpenCommandMenu, onOpenMobileMenu }: TopNavbarProps) {
  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-0 right-0 left-0 md:left-[260px] z-30 flex h-16 items-center justify-between px-4 md:px-6 bg-[#131316]/60 border-b border-white/10 backdrop-blur-[20px]"
    >
      {/* Left: Global Search & Command Trigger */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-white/5 transition-colors focus:outline-none"
        >
          <Menu className="h-5 w-5" />
        </button>
        <SearchBar onOpenCommandMenu={onOpenCommandMenu} />
      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center gap-2 md:gap-3">
        <NotificationButton />
        <div className="h-4 w-px bg-white/10 mx-1" />
        <UserMenu />
      </div>
    </motion.header>
  );
}
