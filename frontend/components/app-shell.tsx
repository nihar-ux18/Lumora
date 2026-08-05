"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { TopNavbar } from "./top-navbar";
import { PageContainer } from "./page-container";
import { CommandMenu } from "./command-menu";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#0A0A0B] text-foreground font-sans antialiased">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Top Navbar */}
      <TopNavbar onOpenCommandMenu={() => setIsCommandMenuOpen(true)} />

      {/* Main Page Container */}
      <PageContainer>{children}</PageContainer>

      {/* Command Menu Modal Overlay */}
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
      />
    </div>
  );
}
