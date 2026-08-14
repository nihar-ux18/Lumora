import { describe, it, expect } from "vitest";
import { cn, formatDate, truncateText, getInitials, getDeterministicColor, getErrorMessage } from "../lib/utils";
import axios from "axios";

describe("Unit Tests — Utility Functions", () => {
  describe("cn", () => {
    it("combines class names correctly", () => {
      expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
      expect(cn("bg-red-500", { "text-white": true, "hidden": false })).toBe("bg-red-500 text-white");
    });
  });

  describe("formatDate", () => {
    it("formats valid dates properly", () => {
      expect(formatDate("2026-08-15T00:00:00Z")).toBe("Aug 15, 2026");
    });

    it("returns N/A for empty or malformed dates", () => {
      expect(formatDate(null)).toBe("N/A");
      expect(formatDate("invalid-date")).toBe("N/A");
    });
  });

  describe("truncateText", () => {
    it("truncates text exceeding maxLength", () => {
      expect(truncateText("Hello World", 5)).toBe("Hello...");
    });

    it("does not truncate text under maxLength", () => {
      expect(truncateText("Hello", 10)).toBe("Hello");
    });
  });

  describe("getInitials", () => {
    it("gets first two initials of a name", () => {
      expect(getInitials("Nihar Patil")).toBe("NP");
      expect(getInitials("Google DeepMind team")).toBe("GD");
    });

    it("handles single name or empty name", () => {
      expect(getInitials("Antigravity")).toBe("A");
      expect(getInitials("")).toBe("");
    });
  });

  describe("getDeterministicColor", () => {
    it("returns deterministic tailwind colors", () => {
      const color1 = getDeterministicColor("workspace-1");
      const color2 = getDeterministicColor("workspace-1");
      expect(color1).toBe(color2);
      expect(color1).toMatch(/^bg-/);
    });
  });

  describe("getErrorMessage", () => {
    it("formats validation fast-api 422 list errors", () => {
      const mockAxiosError = {
        isAxiosError: true,
        message: "Request failed with status code 422",
        response: {
          status: 422,
          data: {
            detail: [
              { msg: "Field is required", loc: ["body", "name"] },
              { msg: "Must be a string", loc: ["body", "desc"] }
            ]
          }
        }
      };
      
      // Force it to look like an AxiosError
      Object.setPrototypeOf(mockAxiosError, axios.AxiosError.prototype);

      expect(getErrorMessage(mockAxiosError)).toBe("Field is required, Must be a string");
    });

    it("formats offline/network connection failures", () => {
      const mockNetworkError = {
        isAxiosError: true,
        message: "Network Error",
        response: undefined
      };
      Object.setPrototypeOf(mockNetworkError, axios.AxiosError.prototype);
      expect(getErrorMessage(mockNetworkError)).toBe("Network error. Please check your connection.");
    });

    it("returns status-specific error messages", () => {
      const makeMockError = (status: number, detail?: string) => {
        const err = {
          isAxiosError: true,
          response: {
            status,
            data: detail ? { detail } : {}
          }
        };
        Object.setPrototypeOf(err, axios.AxiosError.prototype);
        return err;
      };

      expect(getErrorMessage(makeMockError(401))).toBe("Session expired. Please log in again.");
      expect(getErrorMessage(makeMockError(403))).toBe("You do not have permission to perform this action.");
      expect(getErrorMessage(makeMockError(404))).toBe("The requested resource could not be found.");
      expect(getErrorMessage(makeMockError(409))).toBe("A conflict occurred with the request.");
      expect(getErrorMessage(makeMockError(429))).toBe("Too many requests. Please try again later.");
      expect(getErrorMessage(makeMockError(500))).toBe("Internal server error. Please try again later.");
      
      // Custom server detail overrides
      expect(getErrorMessage(makeMockError(400, "Invalid email format"))).toBe("Invalid email format");
    });
  });
});
