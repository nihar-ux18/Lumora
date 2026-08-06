"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, AlertCircle } from "lucide-react";
import { useLoginForm } from "@/hooks/use-login-form";
import { PasswordInput } from "./password-input";
import { SocialLoginPlaceholder } from "./social-login-placeholder";

export function LoginForm() {
  const { form, isLoading, serverError, onSubmit } = useLoginForm();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="w-full">
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-[13px] text-red-400 flex items-start gap-2"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{serverError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-medium text-foreground"
          >
            Email Address
          </label>
          <div className="relative flex items-center rounded-[12px] bg-[#131316]/80 border border-white/10 px-3.5 py-2.5 backdrop-blur-[20px] focus-within:border-[#4A00FF]/60 transition-colors">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0 mr-2.5" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              {...register("email")}
            />
          </div>
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-[11px] font-medium text-red-400 pl-1"
              >
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password Field */}
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center h-4 w-4 rounded-[4px] border border-white/20 bg-black/20 group-hover:border-[#4A00FF]/50 transition-colors">
              <input
                type="checkbox"
                className="peer absolute inset-0 opacity-0 cursor-pointer"
                {...register("rememberMe")}
              />
              <svg
                className="h-2.5 w-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <div className="absolute inset-0 rounded-[4px] bg-[#4A00FF] opacity-0 peer-checked:opacity-100 transition-opacity -z-10" />
            </div>
            <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
              Remember me
            </span>
          </label>

          <Link
            href="#"
            className="text-[11px] font-medium text-[#4A00FF] hover:text-[#5A14FF] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={!isLoading ? { scale: 1.01 } : {}}
          whileTap={!isLoading ? { scale: 0.99 } : {}}
          type="submit"
          disabled={isLoading}
          className="relative flex w-full items-center justify-center h-10 mt-2 rounded-[12px] bg-[#4A00FF] text-[13px] font-semibold text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
        >
          <span className={`flex items-center gap-2 ${isLoading ? "opacity-0" : "opacity-100"}`}>
            Sign in
          </span>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </motion.button>
      </form>

      <SocialLoginPlaceholder />

      <p className="mt-8 text-center text-[12px] text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-foreground hover:text-[#4A00FF] transition-colors"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
