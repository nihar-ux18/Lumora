import { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | Lumora",
  description: "Sign in to your Lumora account to access your workspace.",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Welcome back"
          subtitle="Sign in to your account to continue"
        />
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
}
