import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "../lib/api-client";
import { authService } from "../services/auth.service";
import { workspaceService } from "../services/workspace.service";
import { resourceService } from "../services/resource.service";
import { chatService } from "../services/chat.service";
import axios from "axios";

// Helper to make fake rejected Axios promises matching specific HTTP codes
const makeAxiosReject = (status: number, message: string = "Request failed") => {
  const err = {
    isAxiosError: true,
    message,
    response: {
      status,
      data: { detail: message }
    }
  };
  Object.setPrototypeOf(err, axios.AxiosError.prototype);
  return Promise.reject(err);
};

describe("Integration & E2E Flows Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Authentication Flow Integration", () => {
    it("handles successful login and stores token", async () => {
      const postSpy = vi.spyOn(apiClient, "post").mockResolvedValue({
        data: { access_token: "jwt-token-xyz", token_type: "bearer" }
      });

      const response = await authService.login({
        email: "nihar@example.com",
        password: "securePassword123!"
      });

      expect(postSpy).toHaveBeenCalledWith("/auth/login", {
        email: "nihar@example.com",
        password: "securePassword123!"
      });
      expect(response.access_token).toBe("jwt-token-xyz");
    });

    it("handles login failures with invalid credentials correctly", async () => {
      vi.spyOn(apiClient, "post").mockImplementation(() => makeAxiosReject(401, "Invalid credentials"));

      await expect(
        authService.login({ email: "wrong@example.com", password: "pwd" })
      ).rejects.toThrow("Invalid credentials");
    });

    it("handles register flow successfully", async () => {
      const postSpy = vi.spyOn(apiClient, "post").mockResolvedValue({
        data: { id: "user-123", fullname: "Nihar Patil", email: "nihar@example.com" }
      });

      const response = await authService.register({
        fullname: "Nihar Patil",
        email: "nihar@example.com",
        password: "pwd"
      });

      expect(postSpy).toHaveBeenCalledWith("/auth/register", {
        fullname: "Nihar Patil",
        email: "nihar@example.com",
        password: "pwd"
      });
      expect(response.email).toBe("nihar@example.com");
    });
  });

  describe("Workspaces Flow Integration", () => {
    it("fetches list of workspaces successfully", async () => {
      const mockList = [
        { id: "ws-1", name: "Engineering Specs", description: "Design specifications", owner_id: "u-1", created_at: "", updated_at: "" },
        { id: "ws-2", name: "Research Papers", description: "Math publications", owner_id: "u-1", created_at: "", updated_at: "" }
      ];

      vi.spyOn(apiClient, "get").mockResolvedValue({ data: mockList });

      const response = await workspaceService.listWorkspaces();
      expect(response).toHaveLength(2);
      expect(response[0].name).toBe("Engineering Specs");
      expect(response[1].name).toBe("Research Papers");
    });

    it("creates a new workspace successfully", async () => {
      const mockWorkspace = {
        id: "ws-new",
        name: "New Workspace",
        description: "Created in test",
        owner_id: "u-1",
        created_at: "",
        updated_at: ""
      };

      const postSpy = vi.spyOn(apiClient, "post").mockResolvedValue({ data: mockWorkspace });

      const response = await workspaceService.createWorkspace({
        name: "New Workspace",
        description: "Created in test"
      });

      expect(postSpy).toHaveBeenCalledWith("/workspaces", {
        name: "New Workspace",
        description: "Created in test"
      });
      expect(response.id).toBe("ws-new");
    });
  });

  describe("Resources Flow Integration", () => {
    it("lists workspace resources correctly", async () => {
      const mockResources = [
        { id: "r-1", workspace_id: "ws-1", title: "API Specs.pdf", resource_type: "file", file_path: "path/1", source_url: null, created_at: "", updated_at: "" }
      ];

      vi.spyOn(apiClient, "get").mockResolvedValue({ data: mockResources });

      const response = await resourceService.listResources("ws-1");
      expect(response).toHaveLength(1);
      expect(response[0].title).toBe("API Specs.pdf");
    });

    it("deletes a resource successfully", async () => {
      const deleteSpy = vi.spyOn(apiClient, "delete").mockResolvedValue({ data: {} });

      await resourceService.deleteResource("r-1");
      expect(deleteSpy).toHaveBeenCalledWith("/resources/r-1");
    });
  });

  describe("AI Features Flow Integration", () => {
    it("creates a chat conversation session successfully", async () => {
      const mockChat = { id: "chat-1", workspace_id: "ws-1", title: "Study session", created_at: "", updated_at: "" };
      const postSpy = vi.spyOn(apiClient, "post").mockResolvedValue({ data: mockChat });

      const response = await chatService.createChat("ws-1", { title: "Study session" });
      expect(postSpy).toHaveBeenCalledWith("/chats/workspaces/ws-1", { title: "Study session" });
      expect(response.id).toBe("chat-1");
    });

    it("sends a message and returns the reply with sources", async () => {
      const mockReply = {
        user_message: { id: "m-1", role: "user", content: "What is quantum computing?", created_at: "", updated_at: "" },
        assistant_message: { id: "m-2", role: "assistant", content: "It is a field of computing...", created_at: "", updated_at: "" },
        sources: [
          { chunk_index: 0, content: "Quantum computing is...", resource_title: "Quantum.pdf" }
        ]
      };

      vi.spyOn(apiClient, "post").mockResolvedValue({ data: mockReply });

      const response = await chatService.addMessage("chat-1", { content: "What is quantum computing?" });
      expect(response.assistant_message.content).toBe("It is a field of computing...");
      expect(response.sources).toHaveLength(1);
      expect(response.sources[0].resource_title).toBe("Quantum.pdf");
    });
  });

  describe("Workspace Members Flow Integration", () => {
    it("invites a member successfully", async () => {
      const mockInvitation = {
        id: "inv-1",
        workspace_id: "ws-1",
        email: "friend@example.com",
        token: "tok-abc",
        expires_at: "",
        accepted: false,
        created_at: ""
      };

      const postSpy = vi.spyOn(apiClient, "post").mockResolvedValue({ data: mockInvitation });

      const response = await workspaceService.inviteMember("ws-1", { email: "friend@example.com" });
      expect(postSpy).toHaveBeenCalledWith("/workspaces/ws-1/invite", { email: "friend@example.com" });
      expect(response.email).toBe("friend@example.com");
    });
  });

  describe("Edge Cases & Reliability boundaries", () => {
    it("handles 429 Too Many Requests rate-limiting cleanly", async () => {
      vi.spyOn(apiClient, "get").mockImplementation(() => makeAxiosReject(429, "Too many requests"));

      await expect(workspaceService.listWorkspaces()).rejects.toThrow("Too many requests");
    });

    it("handles 500 Server Errors gracefully", async () => {
      vi.spyOn(apiClient, "get").mockImplementation(() => makeAxiosReject(500, "Internal server error"));

      await expect(workspaceService.listWorkspaces()).rejects.toThrow("Internal server error");
    });

    it("handles network unreachable/offline timeouts correctly", async () => {
      vi.spyOn(apiClient, "get").mockImplementation(() => makeAxiosReject(0, "Network Error"));

      await expect(workspaceService.listWorkspaces()).rejects.toThrow("Network Error");
    });

    it("handles 401 expired JWT / unauthorized requests properly", async () => {
      vi.spyOn(apiClient, "get").mockImplementation(() => makeAxiosReject(401, "Session expired"));
      await expect(workspaceService.listWorkspaces()).rejects.toThrow("Session expired");
    });

    it("handles 403 forbidden access to workspaces cleanly", async () => {
      vi.spyOn(apiClient, "get").mockImplementation(() => makeAxiosReject(403, "Access denied"));
      await expect(workspaceService.listWorkspaces()).rejects.toThrow("Access denied");
    });

    it("handles 404 deleted or missing resource details lookup", async () => {
      vi.spyOn(apiClient, "get").mockImplementation(() => makeAxiosReject(404, "Not found"));
      await expect(workspaceService.getWorkspace("ws-not-exist")).rejects.toThrow("Not found");
    });

    it("handles 422 payload validation failures properly", async () => {
      vi.spyOn(apiClient, "post").mockImplementation(() => makeAxiosReject(422, "Validation failed"));
      await expect(workspaceService.createWorkspace({ name: "", description: "" })).rejects.toThrow("Validation failed");
    });

    it("handles 400 invalid or expired invitation link accept attempts", async () => {
      vi.spyOn(apiClient, "post").mockImplementation(() => makeAxiosReject(400, "Invalid token"));
      await expect(workspaceService.inviteMember("ws-1", { email: "bad-email" })).rejects.toThrow("Invalid token");
    });
  });
});
