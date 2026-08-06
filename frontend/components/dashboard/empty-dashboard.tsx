"use client";

import { motion } from "framer-motion";
import { Sparkles, FolderPlus } from "lucide-react";
import { DashboardHeader } from "./dashboard-header";

export function EmptyDashboard() {
  return (
    <>
      <DashboardHeader />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center justify-center min-h-[400px] rounded-[24px] bg-[#131316]/60 border border-white/10 p-8 text-center backdrop-blur-[20px]"
      >
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#4A00FF]/10 mb-6">
          <div className="absolute inset-0 rounded-full animate-ping bg-[#4A00FF]/20 opacity-75" />
          <Sparkles className="h-10 w-10 text-[#4A00FF]" />
        </div>
        
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">
          Your knowledge base is empty
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mb-8">
          Get started by creating your first workspace. Upload resources, generate AI summaries, and build your personalized learning environment.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-[12px] bg-[#4A00FF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors"
        >
          <FolderPlus className="h-4 w-4" />
          Create Workspace
        </motion.button>
      </motion.div>
    </>
  );
}
