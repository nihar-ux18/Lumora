import { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create an Account | Lumora",
  description: "Join Lumora to organize your thoughts and collaborate with AI.",
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Create an account"
          subtitle="Enter your details to get started with Lumora"
        />
        <RegisterForm />
      </AuthCard>
    </AuthLayout>
  );
}
