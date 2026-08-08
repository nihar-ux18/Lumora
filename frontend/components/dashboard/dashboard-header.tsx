"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/providers/auth-provider";

export function DashboardHeader() {
  const { currentUser } = useAuth();
  
  const currentDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const displayName = currentUser?.fullname || currentUser?.email?.split('@')[0] || "User";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"
    >
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase mb-1">
          {currentDate}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Welcome back, <span className="text-[#4A00FF]">{displayName}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s an overview of your knowledge base and recent activities.
        </p>
      </div>
    </motion.div>
  );
}
