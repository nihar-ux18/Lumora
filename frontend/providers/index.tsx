"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth-provider";
import { Toaster } from "sonner";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </AuthProvider>
    </QueryProvider>
  );
}

export * from "./query-provider";
export * from "./auth-provider";
