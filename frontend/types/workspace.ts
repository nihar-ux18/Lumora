export interface Workspace {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  ownerId: string;
  memberCount?: number;
  documentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: "owner" | "editor" | "viewer";
  joinedAt: string;
}

export interface Document {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}
