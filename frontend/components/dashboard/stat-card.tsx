"use client";

import { motion } from "framer-motion";
import { Folder, FileText, Sparkles, BrainCircuit, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  trend: "up" | "down" | "neutral";
  icon: string;
  delay?: number;
}

const iconMap: Record<string, React.ElementType> = {
  Folder,
  FileText,
  Sparkles,
  BrainCircuit,
};

export function StatCard({ title, value, description, trend, icon, delay = 0 }: StatCardProps) {
  const Icon = iconMap[icon] || Folder;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02, translateY: -2 }}
      className="relative overflow-hidden rounded-[16px] bg-[#131316]/60 border border-white/10 p-5 backdrop-blur-[20px] transition-colors hover:border-white/20 hover:bg-[#131316]/80 group"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white/5 border border-white/10 group-hover:bg-[#4A00FF]/10 group-hover:border-[#4A00FF]/20 group-hover:text-[#4A00FF] transition-colors">
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-[#4A00FF] transition-colors" />
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </span>
        <div className="flex items-center gap-1.5 mt-1">
          {trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-400" />}
          {trend === "down" && <TrendingDown className="h-3 w-3 text-red-400" />}
          {trend === "neutral" && <Minus className="h-3 w-3 text-zinc-400" />}
          <span className={`text-[11px] font-medium ${
            trend === "up" ? "text-emerald-400" :
            trend === "down" ? "text-red-400" :
            "text-zinc-400"
          }`}>
            {description}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
