"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useMutation } from "@tanstack/react-query";
import { quizService, QuizQuestion, QuizSubmissionResponse } from "@/services/quiz.service";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { WorkspaceBreadcrumbs } from "@/components/workspaces/workspace-breadcrumbs";
import { WorkspaceNavigation } from "@/components/workspaces/workspace-navigation";

export default function QuizPage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  
  const [quizState, setQuizState] = useState<"idle" | "generating" | "playing" | "submitting" | "results">("idle");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [submissionResult, setSubmissionResult] = useState<QuizSubmissionResponse | null>(null);

  const generateMutation = useMutation({
    mutationFn: () => quizService.generateQuiz(workspaceId, { topic, num_questions: numQuestions }),
    onMutate: () => setQuizState("generating"),
    onSuccess: (data) => {
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(-1));
      setCurrentQuestionIdx(0);
      setQuizState("playing");
      toast.success("Quiz generated successfully");
    },
    onError: (error) => {
      setQuizState("idle");
      let msg = "Failed to generate quiz";
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        msg = Array.isArray(error.response.data.detail) 
          ? error.response.data.detail.map((e: { msg: string }) => e.msg).join(", ") 
          : error.response.data.detail;
      }
      toast.error(msg);
    },
    retry: false,
  });

  const submitMutation = useMutation({
    mutationFn: () => quizService.submitQuiz({ questions, answers }),
    onMutate: () => setQuizState("submitting"),
    onSuccess: (data) => {
      setSubmissionResult(data);
      setQuizState("results");
      toast.success("Quiz evaluated successfully");
    },
    onError: () => {
      setQuizState("playing");
      toast.error("Failed to submit quiz");
    }
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || generateMutation.isPending) return;
    generateMutation.mutate();
  };

  const handleOptionSelect = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIdx] = optionIdx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(c => c + 1);
    } else {
      if (answers.includes(-1)) {
        toast.error("Please answer all questions before submitting");
        return;
      }
      submitMutation.mutate();
    }
  };

  const resetQuiz = () => {
    setQuizState("idle");
    setQuestions([]);
    setAnswers([]);
    setCurrentQuestionIdx(0);
    setSubmissionResult(null);
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl min-h-[calc(100vh-8rem)]">
        <WorkspaceBreadcrumbs workspaceId={workspaceId} />
        <WorkspaceNavigation workspaceId={workspaceId} />
        
        <div className="flex flex-col gap-6">
          
          {quizState === "idle" || quizState === "generating" ? (
            <div className="rounded-[20px] bg-[#131316]/60 border border-white/10 p-6 backdrop-blur-[20px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#4A00FF]/20 text-[#4A00FF]">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">AI Quiz</h1>
                  <p className="text-sm text-muted-foreground">Test your knowledge with an AI-generated quiz.</p>
                </div>
              </div>

              <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row items-end gap-4 mt-6">
                <div className="flex-1 w-full space-y-1.5">
                  <label className="text-xs text-muted-foreground font-medium pl-1">Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="E.g., Quantum Computing Basics"
                    disabled={generateMutation.isPending}
                    className="w-full h-12 px-4 rounded-[12px] bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors disabled:opacity-50"
                  />
                </div>
                <div className="w-full sm:w-24 space-y-1.5">
                  <label className="text-xs text-muted-foreground font-medium pl-1">Questions</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    disabled={generateMutation.isPending}
                    className="w-full h-12 px-4 rounded-[12px] bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors disabled:opacity-50 text-center"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!topic.trim() || generateMutation.isPending}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-6 rounded-[12px] bg-[#4A00FF] text-sm font-medium text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors disabled:opacity-50"
                >
                  {generateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {generateMutation.isPending ? "Generating..." : "Generate"}
                </button>
              </form>

              {quizState === "generating" && (
                <div className="mt-8 flex flex-col items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-[#4A00FF] mb-4" />
                  <p className="text-sm text-muted-foreground">Reading your resources and crafting the perfect quiz...</p>
                </div>
              )}
            </div>
          ) : quizState === "playing" || quizState === "submitting" ? (
            <div className="rounded-[20px] bg-[#131316]/60 border border-white/10 p-8 backdrop-blur-[20px]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Question {currentQuestionIdx + 1} of {questions.length}
                </h2>
                <button onClick={resetQuiz} className="text-xs text-muted-foreground hover:text-white transition-colors">
                  Cancel Quiz
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-xl md:text-2xl font-medium text-foreground mb-8 leading-relaxed">
                    {questions[currentQuestionIdx].question}
                  </h3>

                  <div className="space-y-3">
                    {questions[currentQuestionIdx].options.map((option, idx) => {
                      const isSelected = answers[currentQuestionIdx] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(idx)}
                          disabled={quizState === "submitting"}
                          className={`w-full flex items-center p-4 rounded-[16px] border text-left transition-all ${
                            isSelected 
                              ? "bg-[#4A00FF]/10 border-[#4A00FF] shadow-[0_0_15px_rgba(74,0,255,0.1)]" 
                              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                          } disabled:opacity-50`}
                        >
                          <div className={`flex items-center justify-center h-6 w-6 rounded-full border text-xs mr-4 ${
                            isSelected ? "border-[#4A00FF] bg-[#4A00FF] text-white" : "border-white/20 text-muted-foreground"
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className={`text-sm ${isSelected ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                            {option}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
                <button
                  onClick={() => setCurrentQuestionIdx(c => c - 1)}
                  disabled={currentQuestionIdx === 0 || quizState === "submitting"}
                  className="px-6 py-2.5 rounded-[12px] bg-white/5 text-sm font-medium text-foreground hover:bg-white/10 transition-colors disabled:opacity-30"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={quizState === "submitting"}
                  className="flex items-center gap-2 px-8 py-2.5 rounded-[12px] bg-[#4A00FF] text-sm font-medium text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors disabled:opacity-50"
                >
                  {quizState === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {currentQuestionIdx === questions.length - 1 ? "Submit" : "Next"}
                </button>
              </div>
            </div>
          ) : quizState === "results" && submissionResult ? (
            <div className="space-y-6">
              <div className="rounded-[20px] bg-[#131316]/60 border border-white/10 p-8 backdrop-blur-[20px] text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#4A00FF]/10 mb-6">
                  <span className="text-3xl font-bold text-[#4A00FF]">{submissionResult.percentage}%</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Completed!</h2>
                <p className="text-muted-foreground">
                  You scored {submissionResult.score} out of {submissionResult.total_questions}.
                </p>
                <button 
                  onClick={resetQuiz}
                  className="mt-6 px-6 py-2.5 rounded-[12px] bg-white/10 text-sm font-medium text-foreground hover:bg-white/15 transition-colors"
                >
                  Take Another Quiz
                </button>
              </div>

              <div className="space-y-4">
                {submissionResult.results.map((result, idx) => (
                  <div key={idx} className="rounded-[16px] bg-[#131316]/60 border border-white/10 p-6 backdrop-blur-[20px]">
                    <div className="flex items-start gap-4 mb-4">
                      {result.is_correct ? (
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-500/20 text-green-500 shrink-0 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-500/20 text-red-500 shrink-0 mt-0.5">
                          <XCircle className="h-4 w-4" />
                        </div>
                      )}
                      <h3 className="text-base font-medium text-foreground leading-relaxed">
                        <span className="text-muted-foreground mr-2">{idx + 1}.</span> 
                        {result.question}
                      </h3>
                    </div>

                    <div className="pl-10 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 rounded-[10px] bg-white/5 border border-white/10">
                          <p className="text-[10px] text-muted-foreground uppercase mb-1">Your Answer</p>
                          <p className={`text-sm ${result.is_correct ? "text-green-400" : "text-red-400"}`}>
                            {questions[idx].options[result.selected_answer]}
                          </p>
                        </div>
                        {!result.is_correct && (
                          <div className="p-3 rounded-[10px] bg-green-500/10 border border-green-500/20">
                            <p className="text-[10px] text-green-500/70 uppercase mb-1">Correct Answer</p>
                            <p className="text-sm text-green-400">
                              {questions[idx].options[result.correct_answer]}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 rounded-[12px] bg-[#4A00FF]/5 border border-[#4A00FF]/10">
                        <p className="text-[11px] font-semibold text-[#4A00FF] uppercase mb-1.5 flex items-center gap-1.5">
                          <Brain className="h-3.5 w-3.5" /> Explanation
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {result.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

        </div>
      </div>
    </AppShell>
  );
}
