import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

export const ACCESS_TOKEN_KEY = "lumora_access_token";

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
        config.headers.Authorization = `Bearer ${token}`;
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
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          // Potential redirect logic here
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
