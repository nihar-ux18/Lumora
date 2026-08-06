"use client";

import Link from "next/link";

export function AuthFooter() {
  return (
    <footer className="mt-8 text-center text-[11px] text-muted-foreground space-y-2">
      <div className="flex items-center justify-center gap-4">
        <Link href="#" className="hover:text-foreground transition-colors">
          Privacy Policy
        </Link>
        <span>•</span>
        <Link href="#" className="hover:text-foreground transition-colors">
          Terms of Service
        </Link>
        <span>•</span>
        <Link href="#" className="hover:text-foreground transition-colors">
          Help Center
        </Link>
      </div>
      <p>© {new Date().getFullYear()} Lumora AI Inc. All rights reserved.</p>
    </footer>
  );
}
