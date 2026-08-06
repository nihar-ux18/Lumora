"use client";

import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, Link as LinkIcon, AlignLeft, Trash2, ExternalLink } from "lucide-react";
import { ResourceType } from "@/services/resource.service";
import { formatDate } from "@/lib/utils";

interface ResourceCardProps {
  id: string;
  title: string;
  resource_type: ResourceType;
  file_path: string | null;
  source_url: string | null;
  created_at: string;
  delay?: number;
  onDelete?: () => void;
}

const iconMap: Record<ResourceType, React.ElementType> = {
  pdf: FileText,
  docx: FileText,
  image: ImageIcon,
  url: LinkIcon,
  note: AlignLeft,
};

const colorMap: Record<ResourceType, string> = {
  pdf: "bg-red-500/10 text-red-500",
  docx: "bg-blue-500/10 text-blue-500",
  image: "bg-purple-500/10 text-purple-500",
  url: "bg-green-500/10 text-green-500",
  note: "bg-yellow-500/10 text-yellow-500",
};

export function ResourceCard({
  title,
  resource_type,
  file_path,
  source_url,
  created_at,
  delay = 0,
  onDelete,
}: ResourceCardProps) {
  const Icon = iconMap[resource_type] || FileText;
  const colorClass = colorMap[resource_type] || "bg-white/10 text-white";

  const getSubtext = () => {
    if (resource_type === "url" && source_url) {
      try {
        const url = new URL(source_url);
        return url.hostname;
      } catch {
        return source_url;
      }
    }
    if (file_path) {
      return file_path.split("/").pop();
    }
    return "Note";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-[16px] bg-[#131316]/60 border border-white/10 p-5 backdrop-blur-[20px] transition-colors hover:border-white/20 hover:bg-[#131316]/80"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-[12px] ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-2">
          {source_url && (
            <a 
              href={source_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {onDelete && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      <h3 className="text-sm font-semibold text-foreground line-clamp-1 mb-1">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground line-clamp-1 mb-4 flex-1">
        {getSubtext()}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <span className="text-[10px] font-medium text-muted-foreground uppercase">
          {resource_type}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {formatDate(created_at)}
        </span>
      </div>
    </motion.div>
  );
}
