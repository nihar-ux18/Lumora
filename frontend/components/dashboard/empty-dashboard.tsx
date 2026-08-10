"use client";

import { motion } from "framer-motion";
import { FolderPlus, FileUp, Sparkles } from "lucide-react";

interface EmptyDashboardProps {
  onCreateWorkspace?: () => void;
}

export function EmptyDashboard({ onCreateWorkspace }: EmptyDashboardProps = {}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 rounded-full bg-[#4A00FF]/20 blur-3xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[24px] bg-[#131316] border border-white/10 shadow-2xl">
          <FolderPlus className="h-10 w-10 text-[#4A00FF]" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Welcome to Lumora
        </h2>
        <p className="text-sm text-muted-foreground max-w-[400px] mx-auto mb-8 leading-relaxed">
          Your workspace is empty. Create a new workspace to start organizing your knowledge, chatting with AI, and generating insights.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onCreateWorkspace}
            className="flex items-center justify-center gap-2.5 h-11 px-6 rounded-[12px] bg-[#4A00FF] text-sm font-semibold text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors w-full sm:w-auto"
          >
            <FolderPlus className="h-4 w-4" />
            Create Workspace
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full"
      >
        <div className="flex flex-col items-center text-center p-4">
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
            <FileUp className="h-4 w-4 text-blue-400" />
          </div>
          <h3 className="text-xs font-semibold text-foreground mb-1">1. Upload</h3>
          <p className="text-[11px] text-muted-foreground">Add your documents and links</p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <h3 className="text-xs font-semibold text-foreground mb-1">2. Analyze</h3>
          <p className="text-[11px] text-muted-foreground">Let AI process your content</p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
            <FolderPlus className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="text-xs font-semibold text-foreground mb-1">3. Organize</h3>
          <p className="text-[11px] text-muted-foreground">Structure your knowledge</p>
        </div>
      </motion.div>
    </div>
  );
}
