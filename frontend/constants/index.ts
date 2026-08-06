export const AUTH = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFICATION: "/auth/resend-verification",
  REFRESH: "/auth/refresh",
  ME: "/auth/me",
  ADMIN: "/auth/admin",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
};

export const USERS = {
  ME: "/users/me",
  AVATAR: "/users/me/avatar",
};

export const WORKSPACES = {
  LIST: "/workspaces",
  CREATE: "/workspaces",
  DETAILS: (id: string) => `/workspaces/${id}`,
  UPDATE: (id: string) => `/workspaces/${id}`,
  DELETE: (id: string) => `/workspaces/${id}`,
  INVITE: (id: string) => `/workspaces/${id}/invite`,
  ACCEPT_INVITATION: "/workspaces/invitations/accept",
  MEMBERS: (id: string) => `/workspaces/${id}/members`,
  UPDATE_MEMBER: (workspaceId: string, userId: string) => `/workspaces/${workspaceId}/members/${userId}`,
  REMOVE_MEMBER: (workspaceId: string, userId: string) => `/workspaces/${workspaceId}/members/${userId}`,
};

export const RESOURCES = {
  CREATE: (workspaceId: string) => `/workspaces/${workspaceId}/resources`,
  LIST: (workspaceId: string) => `/workspaces/${workspaceId}/resources`,
  DETAILS: (id: string) => `/resources/${id}`,
  UPDATE: (id: string) => `/resources/${id}`,
  DELETE: (id: string) => `/resources/${id}`,
  UPLOAD: (id: string) => `/resources/${id}/upload`,
  SEARCH: (workspaceId: string) => `/workspaces/${workspaceId}/resources/search`,
};

export const CHAT = {
  CREATE: (workspaceId: string) => `/chats/workspaces/${workspaceId}`,
  LIST: (workspaceId: string) => `/chats/workspaces/${workspaceId}`,
  DETAILS: (id: string) => `/chats/${id}`,
  DELETE: (id: string) => `/chats/${id}`,
  ADD_MESSAGE: (id: string) => `/chats/${id}/messages`,
  LIST_MESSAGES: (id: string) => `/chats/${id}/messages`,
};

export const SUMMARY = {
  GENERATE: (workspaceId: string) => `/summary/workspaces/${workspaceId}`,
};

export const REVISION = {
  GENERATE: (workspaceId: string) => `/revision/workspaces/${workspaceId}`,
};

export const QUIZ = {
  GENERATE: (workspaceId: string) => `/quiz/workspaces/${workspaceId}`,
  SUBMIT: "/quiz/submit",
};

export const ROADMAP = {
  GENERATE: (workspaceId: string) => `/roadmap/workspaces/${workspaceId}`,
};
