import { apiClient } from "@/lib/api-client";
import { RESOURCES } from "@/constants";

export interface ResourceCreate {
  title: string;
  type: string;
  content?: string;
  url?: string;
}

export interface ResourceUpdate {
  title?: string;
  type?: string;
  content?: string;
  url?: string;
}

export interface SearchQuery {
  query: string;
  limit?: number;
}

export const resourceService = {
  createResource: async (workspaceId: string, data: ResourceCreate) => {
    const response = await apiClient.post(RESOURCES.CREATE(workspaceId), data);
    return response.data;
  },

  listResources: async (workspaceId: string) => {
    const response = await apiClient.get(RESOURCES.LIST(workspaceId));
    return response.data;
  },

  getResource: async (resourceId: string) => {
    const response = await apiClient.get(RESOURCES.DETAILS(resourceId));
    return response.data;
  },

  updateResource: async (resourceId: string, data: ResourceUpdate) => {
    const response = await apiClient.patch(RESOURCES.UPDATE(resourceId), data);
    return response.data;
  },

  deleteResource: async (resourceId: string) => {
    const response = await apiClient.delete(RESOURCES.DELETE(resourceId));
    return response.data;
  },

  uploadResource: async (resourceId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await apiClient.post(RESOURCES.UPLOAD(resourceId), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  searchResources: async (workspaceId: string, data: SearchQuery) => {
    const response = await apiClient.post(RESOURCES.SEARCH(workspaceId), data);
    return response.data;
  },
};
