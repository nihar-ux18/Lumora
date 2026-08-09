import { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password | Lumora",
  description: "Create a new password for your Lumora account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Create new password"
          subtitle="Please enter your new password below"
        />
        <Suspense fallback={<div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </AuthCard>
    </AuthLayout>
  );
}
