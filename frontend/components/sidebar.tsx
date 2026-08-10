"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Folder,
  Settings,
  Zap,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Workspaces", href: "/workspaces", icon: Folder },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser } = useAuth();

  const userName = currentUser?.fullname || "User";
  const userEmail = currentUser?.email || "user@lumora.ai";
  
  const initials = currentUser?.fullname
    ? currentUser.fullname
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "US";

  return (
    <aside className="fixed top-0 left-0 bottom-0 z-40 hidden md:flex w-[260px] flex-col justify-between bg-[#131316]/60 border-r border-white/10 backdrop-blur-[20px]">
      {/* Top Header & Logo */}
      <div className="flex flex-col">
        <div className="flex h-16 items-center gap-3 px-6 border-b border-white/10">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#4A00FF] shadow-lg shadow-[#4A00FF]/30">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">
              LUMORA
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              v1.0 OS
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 p-4">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href} className="relative block">
                <motion.div
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {/* Active Indicator Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-[12px] bg-[#4A00FF] shadow-md shadow-[#4A00FF]/25"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  <Icon className={`relative z-10 h-4 w-4 ${isActive ? "text-white" : ""}`} />
                  <span className="relative z-10 flex-1">{item.name}</span>

                  {item.badge && (
                    <span
                      className={`relative z-10 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#4A00FF]/20 text-[#4A00FF]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-white/10">
        <Link href="/settings">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex items-center justify-between rounded-[12px] bg-white/5 p-2.5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-8 w-8 border border-white/10 shrink-0">
                <AvatarFallback className="bg-[#4A00FF] text-white text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-foreground truncate">
                  {userName}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {userEmail}
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </motion.div>
        </Link>
      </div>
    </aside>
  );
}
