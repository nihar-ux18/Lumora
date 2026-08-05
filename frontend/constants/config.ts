export const APP_CONFIG = {
  name: "Lumora",
  description: "AI-Powered Workspace & Knowledge Operating System",
  version: "1.0.0",
  apiTimeout: 30000,
  maxFileUploadSize: 10 * 1024 * 1024, // 10 MB
  supportedFileTypes: [
    "application/pdf",
    "text/plain",
    "text/markdown",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  DASHBOARD: "/dashboard",
  WORKSPACES: "/workspaces",
  WORKSPACE_DETAIL: (id: string) => `/workspaces/${id}`,
  SETTINGS: "/settings",
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "lumora_auth_token",
  REFRESH_TOKEN: "lumora_refresh_token",
  USER_DATA: "lumora_user_data",
  THEME: "lumora_theme",
} as const;
