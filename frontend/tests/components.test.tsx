import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorState } from "../components/ui/error-state";
import { PasswordInput } from "../components/auth/password-input";
import { DeleteResourceDialog } from "../components/resources/delete-resource-dialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

// Mock Query Client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("Component Tests", () => {
  describe("ErrorState Component", () => {
    it("renders with custom title and description", () => {
      render(
        <ErrorState
          error={null}
          title="Custom Title"
          description="Custom Description text"
        />
      );
      
      expect(screen.getByText("Custom Title")).toBeInTheDocument();
      expect(screen.getByText("Custom Description text")).toBeInTheDocument();
    });

    it("displays appropriate status title based on axios status code", () => {
      const mockError = {
        isAxiosError: true,
        message: "Not found",
        response: { status: 404, data: { detail: "Item not found" } }
      };
      Object.setPrototypeOf(mockError, axios.AxiosError.prototype);

      render(<ErrorState error={mockError} />);
      expect(screen.getByText("Not Found")).toBeInTheDocument();
      expect(screen.getByText("The requested resource could not be found.")).toBeInTheDocument();
    });

    it("triggers onRetry callback when clicked", () => {
      const onRetryMock = vi.fn();
      render(<ErrorState error={new Error("Failed")} onRetry={onRetryMock} retryText="Retry Action" />);
      
      const retryButton = screen.getByRole("button", { name: "Retry Action" });
      fireEvent.click(retryButton);
      expect(onRetryMock).toHaveBeenCalledTimes(1);
    });

    it("triggers onBack callback when clicked", () => {
      const onBackMock = vi.fn();
      render(<ErrorState error={new Error("Failed")} onBack={onBackMock} backText="Back Action" />);
      
      const backButton = screen.getByRole("button", { name: "Back Action" });
      fireEvent.click(backButton);
      expect(onBackMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("PasswordInput Component", () => {
    it("associates input and label using useId and displays errors", () => {
      render(<PasswordInput label="Your Password" error="Password must be complex" />);
      
      screen.getByText("Your Password");
      const input = screen.getByLabelText("Your Password");
      expect(input).toBeInTheDocument();
      expect(input.getAttribute("type")).toBe("password");
      expect(screen.getByText("Password must be complex")).toBeInTheDocument();
    });

    it("toggles password visibility when the show/hide button is clicked", () => {
      render(<PasswordInput label="Your Password" />);
      
      const toggleButton = screen.getByRole("button", { name: "Show password" });
      const input = screen.getByLabelText("Your Password");
      
      expect(input.getAttribute("type")).toBe("password");
      
      fireEvent.click(toggleButton);
      expect(toggleButton.getAttribute("aria-label")).toBe("Hide password");
      expect(input.getAttribute("type")).toBe("text");
      
      fireEvent.click(toggleButton);
      expect(toggleButton.getAttribute("aria-label")).toBe("Show password");
      expect(input.getAttribute("type")).toBe("password");
    });
  });

  describe("DeleteResourceDialog Component", () => {
    it("renders nothing when isOpen is false", () => {
      const { container } = render(
        <DeleteResourceDialog
          isOpen={false}
          onClose={() => {}}
          resourceId="res-123"
          resourceTitle="Sample PDF"
          workspaceId="ws-123"
        />,
        { wrapper }
      );
      expect(container.firstChild).toBeNull();
    });

    it("renders confirmation details when isOpen is true", () => {
      render(
        <DeleteResourceDialog
          isOpen={true}
          onClose={() => {}}
          resourceId="res-123"
          resourceTitle="Sample PDF"
          workspaceId="ws-123"
        />,
        { wrapper }
      );
      
      expect(screen.getByRole("heading", { name: "Delete Resource" })).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
      expect(screen.getByText("Sample PDF")).toBeInTheDocument();
    });
  });
});
