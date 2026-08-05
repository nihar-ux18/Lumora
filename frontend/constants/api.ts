export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
  },
  USER: {
    PROFILE: "/users/profile",
    SETTINGS: "/users/settings",
  },
  WORKSPACES: {
    LIST: "/workspaces",
    DETAIL: (id: string) => `/workspaces/${id}`,
    CREATE: "/workspaces",
    UPDATE: (id: string) => `/workspaces/${id}`,
    DELETE: (id: string) => `/workspaces/${id}`,
    MEMBERS: (id: string) => `/workspaces/${id}/members`,
  },
  DOCUMENTS: {
    LIST: (workspaceId: string) => `/workspaces/${workspaceId}/documents`,
    DETAIL: (id: string) => `/documents/${id}`,
    CREATE: "/documents",
    UPDATE: (id: string) => `/documents/${id}`,
    DELETE: (id: string) => `/documents/${id}`,
    UPLOAD: "/documents/upload",
  },
  AI: {
    CHAT: "/ai/chat",
    SUMMARIZE: "/ai/summarize",
    GENERATE_QUIZ: "/ai/quiz/generate",
    GENERATE_FLASHCARDS: "/ai/flashcards/generate",
    GENERATE_ROADMAP: "/ai/roadmap/generate",
  },
} as const;
