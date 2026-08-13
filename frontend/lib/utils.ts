import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateInput?: string | Date | null): string {
  if (!dateInput) return "N/A";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const WORKSPACE_COLORS = [
  "bg-blue-500",
  "bg-[#4A00FF]",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-cyan-500",
  "bg-purple-500",
  "bg-indigo-500",
];

export function getDeterministicColor(id: string): string {
  if (!id) return WORKSPACE_COLORS[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % WORKSPACE_COLORS.length;
  return WORKSPACE_COLORS[index];
}

export function getErrorMessage(error: unknown, defaultMessage: string = "Something went wrong"): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    // Check if network/offline error
    if (error.message === "Network Error" || !status) {
      return "Network error. Please check your connection.";
    }

    // 1. Prefer safe server-provided message when available
    const serverDetail = error.response?.data?.detail;
    const serverMessage = error.response?.data?.message;

    if (status === 422) {
      if (Array.isArray(serverDetail)) {
        return serverDetail.map((e: { msg: string; loc?: string[] }) => e.msg).join(", ");
      }
      if (typeof serverDetail === "string") {
        return serverDetail;
      }
      return serverMessage || "Validation failed.";
    }

    if (typeof serverDetail === "string" && serverDetail.trim()) {
      return serverDetail;
    }
    if (typeof serverMessage === "string" && serverMessage.trim()) {
      return serverMessage;
    }

    // 2. Known status-specific message
    if (status === 401) {
      return "Session expired. Please log in again.";
    }
    if (status === 403) {
      return "You do not have permission to perform this action.";
    }
    if (status === 404) {
      return "The requested resource could not be found.";
    }
    if (status === 409) {
      return "A conflict occurred with the request.";
    }
    if (status === 429) {
      return "Too many requests. Please try again later.";
    }
    if (status >= 500) {
      return "Internal server error. Please try again later.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return defaultMessage;
}
