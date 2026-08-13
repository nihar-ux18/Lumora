"use client";

import { useState } from "react";
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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      animate={{
        scale: isFocused ? 1.01 : 1,
        borderColor: isFocused ? "rgba(74, 0, 255, 0.50)" : "rgba(255, 255, 255, 0.10)",
      }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onClick={onOpenCommandMenu}
      className={`relative flex items-center gap-2.5 flex-1 sm:flex-initial w-full sm:w-72 md:w-96 max-w-[180px] sm:max-w-none h-9 px-3 rounded-[12px] bg-[#131316]/60 border border-white/10 backdrop-blur-[20px] cursor-pointer hover:border-white/20 transition-colors ${className}`}
    >
      <Search className="h-4 w-4 text-muted-foreground shrink-0" />
      <input
        type="text"
        readOnly
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none cursor-pointer truncate"
      />
      <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono text-muted-foreground shrink-0">
        <Command className="h-2.5 w-2.5" /> K
      </div>
    </motion.div>
  );
}
