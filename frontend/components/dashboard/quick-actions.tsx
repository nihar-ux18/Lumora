"use client";

import { motion } from "framer-motion";
import { FolderPlus, FileUp, Sparkles, BrainCircuit, FileText, BookOpen, Map } from "lucide-react";

const ACTIONS = [
  { title: "Create Workspace", icon: FolderPlus, color: "text-[#4A00FF]", bg: "bg-[#4A00FF]/10", hoverBg: "hover:bg-[#4A00FF]/20" },
  { title: "Upload Resource", icon: FileUp, color: "text-blue-400", bg: "bg-blue-400/10", hoverBg: "hover:bg-blue-400/20" },
  { title: "Start AI Chat", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-400/10", hoverBg: "hover:bg-purple-400/20" },
  { title: "Generate Quiz", icon: BrainCircuit, color: "text-emerald-400", bg: "bg-emerald-400/10", hoverBg: "hover:bg-emerald-400/20" },
  { title: "Generate Summary", icon: FileText, color: "text-amber-400", bg: "bg-amber-400/10", hoverBg: "hover:bg-amber-400/20" },
  { title: "Generate Revision", icon: BookOpen, color: "text-rose-400", bg: "bg-rose-400/10", hoverBg: "hover:bg-rose-400/20" },
  { title: "Generate Roadmap", icon: Map, color: "text-cyan-400", bg: "bg-cyan-400/10", hoverBg: "hover:bg-cyan-400/20" },
];

export function QuickActions() {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold tracking-wide text-foreground mb-4">Quick Actions</h2>
      <div className="flex flex-nowrap gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {ACTIONS.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex shrink-0 items-center gap-2.5 rounded-[12px] border border-white/10 ${action.bg} ${action.hoverBg} px-4 py-2.5 backdrop-blur-[10px] transition-colors`}
            >
              <Icon className={`h-4 w-4 ${action.color}`} />
              <span className="text-xs font-medium text-foreground whitespace-nowrap">
                {action.title}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
