import { apiClient } from "@/lib/api-client";
import { RESOURCES } from "@/constants";
import { AxiosProgressEvent } from "axios";

export type ResourceType = "pdf" | "docx" | "image" | "url" | "note";

export interface ResourceCreate {
  title: string;
  description?: string | null;
  resource_type: ResourceType;
  source_url?: string | null;
}

export interface ResourceUpdate {
  title?: string | null;
  description?: string | null;
  source_url?: string | null;
}

export interface ResourceResponse {
  id: string;
  workspace_id: string;
  uploaded_by: string;
  title: string;
  description: string | null;
  resource_type: ResourceType;
  file_path: string | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SearchQuery {
  query: string;
  limit?: number;
}

export interface SearchResult {
  chunk_index: number;
  content: string;
}

export const resourceService = {
  createResource: async (workspaceId: string, data: ResourceCreate): Promise<ResourceResponse> => {
    const response = await apiClient.post(RESOURCES.CREATE(workspaceId), data);
    return response.data;
  },

  listResources: async (workspaceId: string): Promise<ResourceResponse[]> => {
    const response = await apiClient.get(RESOURCES.LIST(workspaceId));
    return response.data;
  },

  getResource: async (resourceId: string): Promise<ResourceResponse> => {
    const response = await apiClient.get(RESOURCES.DETAILS(resourceId));
    return response.data;
  },

  updateResource: async (resourceId: string, data: ResourceUpdate): Promise<ResourceResponse> => {
    const response = await apiClient.patch(RESOURCES.UPDATE(resourceId), data);
    return response.data;
  },

  deleteResource: async (resourceId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(RESOURCES.DELETE(resourceId));
    return response.data;
  },

  uploadResource: async (
    resourceId: string, 
    file: File, 
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<ResourceResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await apiClient.post(RESOURCES.UPLOAD(resourceId), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    return response.data;
  },

  searchResources: async (workspaceId: string, data: SearchQuery): Promise<SearchResult[]> => {
    const response = await apiClient.post(RESOURCES.SEARCH(workspaceId), data);
    return response.data;
  },
};
