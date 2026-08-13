"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roadmapService, RoadmapResponse } from "@/services/roadmap.service";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Map, Sparkles, Loader2, CheckCircle2, ChevronRight, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { WorkspaceBreadcrumbs } from "@/components/workspaces/workspace-breadcrumbs";
import { WorkspaceNavigation } from "@/components/workspaces/workspace-navigation";

export default function RoadmapPage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const queryClient = useQueryClient();

  const [topic, setTopic] = useState("");
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const cachedRoadmap = queryClient.getQueryData<RoadmapResponse>(["roadmap", workspaceId]);

  const generateMutation = useMutation({
    mutationFn: (topicStr: string) => roadmapService.generateRoadmap(workspaceId, { topic: topicStr }),
    onSuccess: (data) => {
      queryClient.setQueryData(["roadmap", workspaceId], data);
      setCompletedSteps(new Set());
      toast.success("Learning roadmap generated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to generate roadmap"));
    },
    retry: false,
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || generateMutation.isPending) return;
    generateMutation.mutate(topic);
  };

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const roadmapSteps = cachedRoadmap?.roadmap || [];
  const progress = roadmapSteps.length === 0 ? 0 : Math.round((completedSteps.size / roadmapSteps.length) * 100);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl min-h-[calc(100vh-8rem)]">
        <WorkspaceBreadcrumbs workspaceId={workspaceId} />
        <WorkspaceNavigation workspaceId={workspaceId} />
        
        <div className="flex flex-col gap-6">
          <div className="rounded-[20px] bg-[#131316]/60 border border-white/10 p-6 backdrop-blur-[20px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#4A00FF]/20 text-[#4A00FF]">
                <Map className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Learning Roadmap</h1>
                <p className="text-sm text-muted-foreground">Generate a step-by-step learning path for any topic based on your resources.</p>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-6">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What topic do you want to learn?"
                disabled={generateMutation.isPending}
                className="flex-1 h-12 px-4 rounded-[12px] bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!topic.trim() || generateMutation.isPending}
                className="flex items-center justify-center gap-2 h-12 px-6 rounded-[12px] bg-[#4A00FF] text-sm font-medium text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors disabled:opacity-50 w-full sm:w-auto shrink-0"
              >
                {generateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {generateMutation.isPending ? "Generating..." : "Generate"}
              </button>
            </form>
          </div>

          <div className="flex-1 rounded-[20px] bg-[#131316]/60 border border-white/10 p-8 backdrop-blur-[20px] min-h-[400px]">
            {generateMutation.isPending ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#4A00FF] mb-4" />
                <p className="text-sm text-muted-foreground">Analyzing resources and building your roadmap...</p>
              </div>
            ) : roadmapSteps.length > 0 ? (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[16px] bg-white/5 border border-white/10 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Your Progress</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {completedSteps.size} of {roadmapSteps.length} steps completed
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start gap-4">
                    <span className="text-2xl font-bold text-[#4A00FF]">{progress}%</span>
                    <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden shrink-0">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#4A00FF] to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative pl-6 space-y-6">
                  {/* Vertical Line */}
                  <div className="absolute top-2 left-[27px] bottom-6 w-0.5 bg-white/10 rounded-full" />
                  
                  {roadmapSteps.map((step, idx) => {
                    const isCompleted = completedSteps.has(idx);
                    const isActive = idx === completedSteps.size; // Next logical step

                    return (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`relative flex items-start gap-6 group transition-opacity ${
                          isCompleted ? "opacity-60 hover:opacity-100" : "opacity-100"
                        }`}
                      >
                        {/* Node */}
                        <div className="relative z-10 flex flex-col items-center mt-1">
                          <button
                            onClick={() => toggleStep(idx)}
                            className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all shadow-lg ${
                              isCompleted 
                                ? "bg-green-500 border-green-500 text-white shadow-green-500/20" 
                                : isActive
                                ? "bg-[#4A00FF] border-[#4A00FF] text-white shadow-[#4A00FF]/30 scale-110"
                                : "bg-[#131316] border-white/20 text-muted-foreground hover:border-white/50"
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : 
                             isActive ? <PlayCircle className="h-3 w-3" /> : 
                             <span className="text-[10px] font-medium">{idx + 1}</span>}
                          </button>
                        </div>

                        {/* Content Card */}
                        <div className={`flex-1 p-5 rounded-[16px] border transition-all cursor-pointer ${
                          isActive 
                            ? "bg-[#4A00FF]/5 border-[#4A00FF]/30 hover:bg-[#4A00FF]/10 shadow-[0_0_15px_rgba(74,0,255,0.05)]" 
                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                        onClick={() => toggleStep(idx)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className={`text-sm font-semibold mb-1 ${
                                isCompleted ? "text-muted-foreground line-through decoration-white/20" : 
                                isActive ? "text-[#4A00FF]" : "text-foreground"
                              }`}>
                                Step {idx + 1}
                              </h4>
                              <p className={`text-sm leading-relaxed ${
                                isCompleted ? "text-muted-foreground" : "text-foreground"
                              }`}>
                                {step}
                              </p>
                            </div>
                            <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${
                              isCompleted ? "text-green-500 opacity-0 group-hover:opacity-100 rotate-90" : 
                              "text-muted-foreground opacity-0 group-hover:opacity-100"
                            }`} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-20">
                <div className="h-16 w-16 bg-[#4A00FF]/10 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#4A00FF]/20">
                  <Map className="h-8 w-8 text-[#4A00FF]" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Ready to Guide You</h3>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                  Enter a topic and we&apos;ll generate a step-by-step learning roadmap tailored to your workspace resources.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
