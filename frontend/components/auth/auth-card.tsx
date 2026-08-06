"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full max-w-md overflow-hidden rounded-[24px] bg-[#131316]/60 border border-white/10 p-8 shadow-2xl backdrop-blur-[24px] ${className}`}
    >
      {children}
    </motion.div>
  );
}
