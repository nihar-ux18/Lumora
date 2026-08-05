"use client";

import { useEffect, useState } from "react";
import { Search, Sparkles, Folder, FileText, Settings, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommandMenuProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function CommandMenu({ isOpen = false, onClose }: CommandMenuProps) {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Command Palette Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-[16px] border border-white/10 bg-[#131316]/90 p-4 shadow-2xl backdrop-blur-[20px]"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-3 px-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Type a command or search..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                autoFocus
              />
              <kbd className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground font-mono">
                <Command className="h-3 w-3" /> ESC
              </kbd>
            </div>

            {/* Quick Actions List (Placeholder) */}
            <div className="mt-3 space-y-1">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
                Quick Commands
              </div>
              <button
                onClick={handleClose}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-white/5 transition-colors"
              >
                <Sparkles className="h-4 w-4 text-[#4A00FF]" />
                <span>Ask AI Assistant</span>
              </button>
              <button
                onClick={handleClose}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-white/5 transition-colors"
              >
                <Folder className="h-4 w-4 text-blue-400" />
                <span>Go to Workspaces</span>
              </button>
              <button
                onClick={handleClose}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-white/5 transition-colors"
              >
                <FileText className="h-4 w-4 text-emerald-400" />
                <span>Create New Document</span>
              </button>
              <button
                onClick={handleClose}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-white/5 transition-colors"
              >
                <Settings className="h-4 w-4 text-zinc-400" />
                <span>Open Settings</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
