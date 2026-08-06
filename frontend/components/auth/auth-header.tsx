"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-3 mb-6">
      <Link href="/" className="flex items-center gap-2 group mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#4A00FF] shadow-lg shadow-[#4A00FF]/30 group-hover:scale-105 transition-transform">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground font-sans">
          LUMORA
        </span>
      </Link>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="text-xs text-muted-foreground max-w-sm">
        {subtitle}
      </p>
    </div>
  );
}
