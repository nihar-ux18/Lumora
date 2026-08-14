"use client";

import { forwardRef, useState, useId } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const generatedId = useId();
    const inputId = props.id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-foreground">
            {label}
          </label>
        )}
        <motion.div
          animate={{
            borderColor: error
              ? "rgba(239, 68, 68, 0.6)"
              : isFocused
              ? "rgba(74, 0, 255, 0.6)"
              : "rgba(255, 255, 255, 0.1)",
          }}
          transition={{ duration: 0.15 }}
          className="relative flex items-center rounded-[12px] bg-[#131316]/80 border border-white/10 px-3.5 py-2.5 backdrop-blur-[20px]"
        >
          <Lock className="h-4 w-4 text-muted-foreground shrink-0 mr-2.5" />
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50 rounded-sm"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-medium text-red-400 pl-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
