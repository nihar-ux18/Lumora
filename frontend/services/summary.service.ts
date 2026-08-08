import { apiClient } from "@/lib/api-client";
import { SUMMARY } from "@/constants";

export interface SummaryGenerateRequest {
  topic: string;
}

export interface SummaryResponse {
  summary: string;
}

export const summaryService = {
  generateSummary: async (workspaceId: string, data: SummaryGenerateRequest): Promise<SummaryResponse> => {
    const response = await apiClient.post(SUMMARY.GENERATE(workspaceId), data);
    return response.data;
  },
};
