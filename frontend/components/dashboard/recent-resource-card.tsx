"use client";

import { motion } from "framer-motion";
import { FileText, MoreVertical, Clock } from "lucide-react";

interface RecentResourceCardProps {
  title: string;
  type: string;
  workspaceName: string;
  lastAccessed: string;
  delay?: number;
}

export function RecentResourceCard({
  title,
  type,
  workspaceName,
  lastAccessed,
  delay = 0,
}: RecentResourceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="group flex items-center justify-between rounded-[12px] bg-white/5 border border-white/10 p-3 hover:bg-white/10 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-blue-500/20 text-blue-400">
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-foreground truncate">{title}</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{type}</span>
            <span className="text-[10px] text-zinc-600">•</span>
            <span className="text-[11px] text-muted-foreground truncate">{workspaceName}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="text-[11px]">{lastAccessed}</span>
        </div>
        <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
