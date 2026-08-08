import { apiClient } from "@/lib/api-client";
import { ROADMAP } from "@/constants";

export interface RoadmapRequest {
  topic: string;
}

export interface RoadmapResponse {
  roadmap: string[];
}

export const roadmapService = {
  generateRoadmap: async (workspaceId: string, data: RoadmapRequest): Promise<RoadmapResponse> => {
    const response = await apiClient.post(ROADMAP.GENERATE(workspaceId), data);
    return response.data;
  },
};
