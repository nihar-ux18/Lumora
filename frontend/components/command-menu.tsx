"use client";

import { useEffect, useState } from "react";
import { Search, Folder, Settings, Command } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CommandMenuProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function CommandMenu({ isOpen = false, onClose }: CommandMenuProps) {
  const [open, setOpen] = useState(isOpen);
  const router = useRouter();

  useEffect(() => {
    // Genuinely required to sync external state changes without triggering React 18 synchronous render warnings during render phase
    const timer = setTimeout(() => setOpen(isOpen), 0);
    return () => clearTimeout(timer);
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

  const handleNavigate = (path: string) => {
    handleClose();
    router.push(path);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="fixed top-24 left-1/2 -translate-x-1/2 -translate-y-0 w-full max-w-xl p-4 bg-[#131316]/90 border border-white/10 rounded-[16px] shadow-2xl backdrop-blur-[20px] outline-none"
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

        <div className="mt-3 space-y-1">
          <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
            Quick Commands
          </div>
          <button
            onClick={() => handleNavigate("/workspaces")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
          >
            <Folder className="h-4 w-4 text-blue-400" />
            <span>Go to Workspaces</span>
          </button>
          <button
            onClick={() => handleNavigate("/settings")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
          >
            <Settings className="h-4 w-4 text-zinc-400" />
            <span>Open Settings</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
