"use client";

import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService, MessageRole, ChatResponse, MessageResponse } from "@/services/chat.service";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare, Send, Sparkles, Loader2, Plus, Trash2, Bot, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import axios from "axios";
import { WorkspaceBreadcrumbs } from "@/components/workspaces/workspace-breadcrumbs";
import { WorkspaceNavigation } from "@/components/workspaces/workspace-navigation";

export default function AIChatPage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");

  const { data: chats = [], isLoading: isChatsLoading } = useQuery({
    queryKey: ["chat-list", workspaceId],
    queryFn: () => chatService.listChats(workspaceId),
  });

  const { data: messages = [], isLoading: isMessagesLoading } = useQuery({
    queryKey: ["messages", activeChatId],
    queryFn: () => chatService.listMessages(activeChatId!),
    enabled: !!activeChatId,
  });

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const createChatMutation = useMutation({
    mutationFn: () => chatService.createChat(workspaceId, { title: "New Chat" }),
    onSuccess: (newChat) => {
      queryClient.setQueryData<ChatResponse[]>(["chat-list", workspaceId], (old) => [newChat, ...(old || [])]);
      setActiveChatId(newChat.id);
    },
    onError: (error) => {
      let msg = "Failed to create chat";
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        msg = Array.isArray(error.response.data.detail) 
          ? error.response.data.detail.map((e: { msg: string }) => e.msg).join(", ") 
          : error.response.data.detail;
      }
      toast.error(msg);
    }
  });

  const deleteChatMutation = useMutation({
    mutationFn: (chatId: string) => chatService.deleteChat(chatId),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["chat-list", workspaceId] });
      if (activeChatId === deletedId) {
        setActiveChatId(null);
      }
      toast.success("Chat deleted");
    },
    onError: () => toast.error("Failed to delete chat"),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => chatService.addMessage(activeChatId!, { content }),
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ["messages", activeChatId] });
      const previousMessages = queryClient.getQueryData<MessageResponse[]>(["messages", activeChatId]);

      const optimisticMsg = {
        id: "temp-" + Date.now(),
        chat_session_id: activeChatId!,
        role: "user" as MessageRole,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData<MessageResponse[]>(["messages", activeChatId], (old) => [...(old || []), optimisticMsg]);
      return { previousMessages };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<MessageResponse[]>(["messages", activeChatId], (old) => {
        // Remove the optimistic user message and append the real user + assistant message
        const filtered = (old || []).filter((msg) => !msg.id.startsWith("temp-"));
        return [...filtered, data.user_message, data.assistant_message];
      });
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(["messages", activeChatId], context?.previousMessages);
      let msg = "Something went wrong.";
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        msg = Array.isArray(error.response.data.detail) 
          ? error.response.data.detail.map((e: { msg: string }) => e.msg).join(", ") 
          : error.response.data.detail;
      }
      toast.error(msg);
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChatId || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(inputMessage);
    setInputMessage("");
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl h-[calc(100vh-8rem)]">
        <WorkspaceBreadcrumbs workspaceId={workspaceId} />
        <WorkspaceNavigation workspaceId={workspaceId} />
        
        <div className="flex h-full rounded-[20px] bg-[#131316]/60 border border-white/10 overflow-hidden backdrop-blur-[20px]">
          
          {/* Chat List Sidebar */}
          <div className="w-[300px] border-r border-white/10 flex flex-col bg-white/5">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#4A00FF]" />
                Conversations
              </h2>
              <button 
                onClick={() => createChatMutation.mutate()}
                disabled={createChatMutation.isPending}
                className="h-8 w-8 rounded-[8px] bg-[#4A00FF]/20 text-[#4A00FF] flex items-center justify-center hover:bg-[#4A00FF]/30 transition-colors disabled:opacity-50"
              >
                {createChatMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {isChatsLoading ? (
                <div className="animate-pulse space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-14 bg-white/5 rounded-[10px]" />
                  ))}
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs text-muted-foreground">No conversations yet.</p>
                </div>
              ) : (
                chats.map((chat) => (
                  <div 
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`group cursor-pointer relative flex items-center justify-between p-3 rounded-[10px] transition-colors ${
                      activeChatId === chat.id ? "bg-[#4A00FF]/10 border border-[#4A00FF]/30" : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className={`text-sm truncate font-medium ${activeChatId === chat.id ? "text-[#4A00FF]" : "text-foreground"}`}>
                        {chat.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(chat.created_at)}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChatMutation.mutate(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col relative">
            {!activeChatId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="h-16 w-16 bg-[#4A00FF]/10 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#4A00FF]/20">
                  <Sparkles className="h-8 w-8 text-[#4A00FF]" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">AI Assistant</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
                  Select an existing conversation or start a new one to ask questions about your workspace resources.
                </p>
                <button
                  onClick={() => createChatMutation.mutate()}
                  disabled={createChatMutation.isPending}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-[12px] bg-[#4A00FF] text-sm font-medium text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  New Conversation
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {isMessagesLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-6 w-6 animate-spin text-[#4A00FF]" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                      No messages yet. Send a message to start!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                      >
                        <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                          msg.role === "user" ? "bg-white/10 text-white" : "bg-[#4A00FF]/20 text-[#4A00FF]"
                        }`}>
                          {msg.role === "user" ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={`p-4 rounded-[16px] text-sm leading-relaxed ${
                          msg.role === "user" 
                            ? "bg-[#4A00FF] text-white rounded-tr-none" 
                            : "bg-white/5 border border-white/10 text-foreground rounded-tl-none"
                        }`}>
                          {msg.content}
                        </div>
                      </motion.div>
                    ))
                  )}

                  {sendMessageMutation.isPending && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 max-w-[85%]"
                    >
                      <div className="shrink-0 h-8 w-8 rounded-full bg-[#4A00FF]/20 text-[#4A00FF] flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="p-4 rounded-[16px] rounded-tl-none bg-white/5 border border-white/10 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4A00FF] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4A00FF] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4A00FF] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}
                  <div ref={bottomRef} />
                </div>

                <div className="p-4 border-t border-white/10 bg-[#131316]/80 backdrop-blur-md">
                  <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask anything about your resources..."
                      disabled={sendMessageMutation.isPending}
                      className="w-full h-12 pl-4 pr-12 rounded-[12px] bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                      className="absolute right-2 flex items-center justify-center h-8 w-8 rounded-[8px] bg-[#4A00FF] text-white hover:bg-[#5A14FF] transition-colors disabled:opacity-50 disabled:hover:bg-[#4A00FF]"
                    >
                      {sendMessageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-0.5" />}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
