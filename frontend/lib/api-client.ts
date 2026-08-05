import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/constants/api";
import { STORAGE_KEYS } from "@/constants/config";
import { getItem } from "./storage";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request Interceptor: Attach Auth Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Handle unauthorized / expired token
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const api = {
  get: <T>(url: string, params?: object) => apiClient.get<unknown, T>(url, { params }),
  post: <T>(url: string, data?: object) => apiClient.post<unknown, T>(url, data),
  put: <T>(url: string, data?: object) => apiClient.put<unknown, T>(url, data),
  patch: <T>(url: string, data?: object) => apiClient.patch<unknown, T>(url, data),
  delete: <T>(url: string) => apiClient.delete<unknown, T>(url),
};

export default apiClient;
