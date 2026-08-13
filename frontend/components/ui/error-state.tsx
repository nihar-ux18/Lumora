"use client";

import { AlertCircle, WifiOff, ShieldAlert, FileQuestion } from "lucide-react";
import axios from "axios";

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  retryText?: string;
  onBack?: () => void;
  backText?: string;
  title?: string;
  description?: string;
}

export function ErrorState({
  error,
  onRetry,
  retryText = "Try Again",
  onBack,
  backText = "Go Back",
  title,
  description,
}: ErrorStateProps) {
  let displayTitle = title || "An error occurred";
  let displayDescription = description || "Something went wrong while loading this page. Please try again.";
  let Icon = AlertCircle;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const isNetworkError = error.message === "Network Error" || !status;

    if (isNetworkError) {
      displayTitle = "Connection Failed";
      displayDescription = "Please check your internet connection or verify the server is reachable.";
      Icon = WifiOff;
    } else if (status === 401) {
      displayTitle = "Session Expired";
      displayDescription = "Your session has expired. Please log in again.";
      Icon = ShieldAlert;
      // Note: We do NOT perform any logout, token removal, or redirect here.
      // The auth redirect and token cleanup is authoritative inside api-client.ts.
    } else if (status === 403) {
      displayTitle = "Access Denied";
      displayDescription = "You do not have permission to view this resource.";
      Icon = ShieldAlert;
    } else if (status === 404) {
      displayTitle = "Not Found";
      displayDescription = "The requested resource could not be found.";
      Icon = FileQuestion;
    } else if (status === 409) {
      displayTitle = "Conflict Detected";
      displayDescription = error.response?.data?.detail || error.response?.data?.message || "A conflict occurred with the current state of the resource.";
      Icon = AlertCircle;
    } else if (status === 429) {
      displayTitle = "Too Many Requests";
      displayDescription = "You are doing that too fast. Please wait a moment and try again.";
      Icon = AlertCircle;
    } else if (status && status >= 500) {
      displayTitle = "Server Error";
      displayDescription = "The server encountered an error processing your request. Please try again later.";
      Icon = AlertCircle;
    } else {
      displayDescription = error.response?.data?.detail || error.response?.data?.message || displayDescription;
    }
  } else if (error instanceof Error && error.message) {
    displayDescription = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 rounded-[16px] bg-[#131316]/40 border border-white/5 text-center px-4 max-w-lg mx-auto w-full">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-6 shadow-lg shadow-red-500/5">
        <Icon className="h-8 w-8" />
      </div>
      <h2 className="text-base font-semibold text-foreground mb-2">{displayTitle}</h2>
      <p className="text-xs text-muted-foreground mb-6 leading-relaxed max-w-sm">
        {displayDescription}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-[10px] bg-white/10 px-5 py-2.5 text-xs font-medium text-foreground hover:bg-white/15 transition-colors"
          >
            {retryText}
          </button>
        )}
        {onBack && (
          <button
            onClick={onBack}
            className="rounded-[10px] border border-white/10 bg-transparent px-5 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            {backText}
          </button>
        )}
      </div>
    </div>
  );
}
