import { apiClient } from "@/lib/api-client";
import { QUIZ } from "@/constants";

export interface QuizGenerateRequest {
  topic: string;
  num_questions: number;
}

export interface QuizSubmissionRequest {
  quiz_id: string;
  answers: Record<string, string>;
}

export const quizService = {
  generateQuiz: async (workspaceId: string, data: QuizGenerateRequest) => {
    const response = await apiClient.post(QUIZ.GENERATE(workspaceId), data);
    return response.data;
  },

  submitQuiz: async (data: QuizSubmissionRequest) => {
    const response = await apiClient.post(QUIZ.SUBMIT, data);
    return response.data;
  },
};
