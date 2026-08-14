"use client";

import { motion } from "framer-motion";
import { Folder, MoreVertical, Clock } from "lucide-react";

interface WorkspacePreviewCardProps {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  color: string;
  delay?: number;
}

export function WorkspacePreviewCard({
  title,
  description,
  lastUpdated,
  color,
  delay = 0,
}: WorkspacePreviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-[16px] bg-[#131316]/60 border border-white/10 p-5 backdrop-blur-[20px] transition-colors hover:border-white/20 hover:bg-[#131316]/80 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-[12px] ${color} shadow-lg shadow-black/20`}>
          <Folder className="h-5 w-5 text-white" />
        </div>
        <div className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="h-4 w-4" />
        </div>
      </div>
      
      <h3 className="text-sm font-semibold text-foreground line-clamp-1 mb-1">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
        {description}
      </p>

      <div className="flex items-center justify-end mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="text-[11px]">{lastUpdated}</span>
        </div>
      </div>
    </motion.div>
  );
}
