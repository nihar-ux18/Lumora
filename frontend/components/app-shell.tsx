"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { TopNavbar } from "./top-navbar";
import { PageContainer } from "./page-container";
import { CommandMenu } from "./command-menu";
import { ProtectedRoute } from "./auth/protected-route";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-[#0A0A0B] text-foreground font-sans antialiased">
        {/* Fixed Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Sidebar */}
        <MobileSidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />

        {/* Top Navbar */}
        <TopNavbar 
          onOpenCommandMenu={() => setIsCommandMenuOpen(true)} 
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Main Page Container */}
        <PageContainer>{children}</PageContainer>

        {/* Command Menu Modal Overlay */}
        <CommandMenu
          isOpen={isCommandMenuOpen}
          onClose={() => setIsCommandMenuOpen(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
