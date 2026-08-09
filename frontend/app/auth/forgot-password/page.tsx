import { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | Lumora",
  description: "Reset your Lumora password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Reset your password"
          subtitle="Enter your email and we'll send you a link to reset your password"
        />
        <ForgotPasswordForm />
      </AuthCard>
    </AuthLayout>
  );
}
