import { apiClient } from "@/lib/api-client";
import { QUIZ } from "@/constants";

export interface QuizGenerateRequest {
  topic: string;
  num_questions: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
}

export interface QuizSubmissionRequest {
  questions: QuizQuestion[];
  answers: number[];
}

export interface QuizResult {
  question: string;
  selected_answer: number;
  correct_answer: number;
  is_correct: boolean;
  explanation: string;
}

export interface QuizSubmissionResponse {
  score: number;
  total_questions: number;
  percentage: number;
  results: QuizResult[];
}

export const quizService = {
  generateQuiz: async (workspaceId: string, data: QuizGenerateRequest): Promise<QuizResponse> => {
    const response = await apiClient.post(QUIZ.GENERATE(workspaceId), data);
    return response.data;
  },

  submitQuiz: async (data: QuizSubmissionRequest): Promise<QuizSubmissionResponse> => {
    const response = await apiClient.post(QUIZ.SUBMIT, data);
    return response.data;
  },
};
