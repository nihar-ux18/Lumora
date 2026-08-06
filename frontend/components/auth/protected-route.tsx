"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Only redirect if not already on an auth page to prevent redirect loops
      if (!pathname?.startsWith("/auth")) {
        router.replace("/auth/login");
      }
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B]">
        <Loader2 className="h-8 w-8 animate-spin text-[#4A00FF]" />
      </div>
    );
  }

  // If not authenticated and on a protected route, we return null while redirecting
  if (!isAuthenticated && !pathname?.startsWith("/auth")) {
    return null;
  }

  return <>{children}</>;
}
