import { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { VerifyEmailContent } from "@/components/auth/verify-email-content";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Email | Lumora",
  description: "Verify your Lumora account email address.",
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Email Verification"
          subtitle="Please wait while we verify your email address"
        />
        <Suspense fallback={<div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Loading...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </AuthCard>
    </AuthLayout>
  );
}
