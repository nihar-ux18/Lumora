import { apiClient } from "@/lib/api-client";
import { REVISION } from "@/constants";

export interface RevisionRequest {
  topic: string;
}

export interface RevisionResponse {
  revision_points: string[];
}

export const revisionService = {
  generateRevision: async (workspaceId: string, data: RevisionRequest): Promise<RevisionResponse> => {
    const response = await apiClient.post(REVISION.GENERATE(workspaceId), data);
    return response.data;
  },
};
