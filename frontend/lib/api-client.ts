import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

export const ACCESS_TOKEN_KEY = "lumora_access_token";

const isMockAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === "true";
const MOCK_TOKEN = "development-mock-token";

export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request Interceptor: Attach Auth Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (token && config.headers) {
        if (isMockAuthEnabled && token === MOCK_TOKEN) {
          // Do not send mock token to real backend
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem(ACCESS_TOKEN_KEY);
          if (isMockAuthEnabled && token === MOCK_TOKEN) {
            // Keep mock session alive even if backend returns 401
          } else {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            // Potential redirect logic here
          }
        }
      } else if (status === 403) {
        console.error("Forbidden: You do not have permission to access this resource.");
      } else if (status === 500) {
        console.error("Internal Server Error: Please try again later.");
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
