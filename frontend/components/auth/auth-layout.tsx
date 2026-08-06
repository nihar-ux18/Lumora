"use client";

import { type ReactNode } from "react";
import { AuthFooter } from "./auth-footer";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0A0A0B] text-foreground p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#4A00FF]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#4A00FF]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {children}
        <AuthFooter />
      </div>
    </div>
  );
}
