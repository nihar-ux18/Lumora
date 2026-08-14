"use client";

import { Search, Command } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  onOpenCommandMenu?: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onOpenCommandMenu,
  placeholder = "Search workspaces, docs, AI...",
  className = "",
}: SearchBarProps) {
  return (
    <motion.button
      type="button"
      onClick={onOpenCommandMenu}
      aria-label="Search workspaces, documents, and AI commands"
      className={`relative flex items-center gap-2.5 flex-1 sm:flex-initial w-full sm:w-72 md:w-96 max-w-[180px] sm:max-w-none h-9 px-3 rounded-[12px] bg-[#131316]/60 border border-white/10 backdrop-blur-[20px] cursor-pointer hover:border-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50 ${className}`}
    >
      <Search className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="w-full text-left text-xs text-muted-foreground truncate">
        {placeholder}
      </span>
      <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono text-muted-foreground shrink-0">
        <Command className="h-2.5 w-2.5" /> K
      </div>
    </motion.button>
  );
}
