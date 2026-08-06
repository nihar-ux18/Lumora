"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // Mock submit simulation delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log("Login submitted successfully:", values);
      // Simulated navigation/action placeholder
    } catch (err) {
      setServerError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    serverError,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
