import { apiClient } from "@/lib/api-client";
import { CHAT } from "@/constants";

export interface ChatCreate {
  title: string;
}

export interface MessageCreate {
  content: string;
}

export const chatService = {
  createChat: async (workspaceId: string, data: ChatCreate) => {
    const response = await apiClient.post(CHAT.CREATE(workspaceId), data);
    return response.data;
  },

  listChats: async (workspaceId: string) => {
    const response = await apiClient.get(CHAT.LIST(workspaceId));
    return response.data;
  },

  getChat: async (chatId: string) => {
    const response = await apiClient.get(CHAT.DETAILS(chatId));
    return response.data;
  },

  deleteChat: async (chatId: string) => {
    const response = await apiClient.delete(CHAT.DELETE(chatId));
    return response.data;
  },

  addMessage: async (chatId: string, data: MessageCreate) => {
    const response = await apiClient.post(CHAT.ADD_MESSAGE(chatId), data);
    return response.data;
  },

  listMessages: async (chatId: string) => {
    const response = await apiClient.get(CHAT.LIST_MESSAGES(chatId));
    return response.data;
  },
};
