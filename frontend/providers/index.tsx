"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth-provider";
import { Toaster } from "sonner";
import { MotionConfig } from "framer-motion";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <MotionConfig reducedMotion="user">
          {children}
        </MotionConfig>
        <Toaster theme="dark" position="bottom-right" />
      </AuthProvider>
    </QueryProvider>
  );
}

export * from "./query-provider";
export * from "./auth-provider";
