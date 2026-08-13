"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <main className="md:ml-[260px] ml-0 pt-16 min-h-screen flex-1 bg-[#0A0A0B] text-foreground overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`p-6 md:p-8 max-w-7xl mx-auto ${className}`}
      >
        {children}
      </motion.div>
    </main>
  );
}
