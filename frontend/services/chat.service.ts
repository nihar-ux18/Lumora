import { apiClient } from "@/lib/api-client";
import { CHAT } from "@/constants";

export interface ChatCreate {
  title: string;
}

export interface ChatResponse {
  id: string;
  workspace_id: string;
  created_by: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface MessageCreate {
  content: string;
}

export type MessageRole = "user" | "assistant";

export interface MessageResponse {
  id: string;
  chat_session_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSource {
  resource_title: string;
  chunk_index: number;
}

export interface ChatReplyResponse {
  user_message: MessageResponse;
  assistant_message: MessageResponse;
  sources: ChatSource[];
}

export const chatService = {
  createChat: async (workspaceId: string, data: ChatCreate): Promise<ChatResponse> => {
    const response = await apiClient.post(CHAT.CREATE(workspaceId), data);
    return response.data;
  },

  listChats: async (workspaceId: string): Promise<ChatResponse[]> => {
    const response = await apiClient.get(CHAT.LIST(workspaceId));
    return response.data;
  },

  getChat: async (chatId: string): Promise<ChatResponse> => {
    const response = await apiClient.get(CHAT.DETAILS(chatId));
    return response.data;
  },

  deleteChat: async (chatId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(CHAT.DELETE(chatId));
    return response.data;
  },

  addMessage: async (chatId: string, data: MessageCreate): Promise<ChatReplyResponse> => {
    const response = await apiClient.post(CHAT.ADD_MESSAGE(chatId), data);
    return response.data;
  },

  listMessages: async (chatId: string): Promise<MessageResponse[]> => {
    const response = await apiClient.get(CHAT.LIST_MESSAGES(chatId));
    return response.data;
  },
};
