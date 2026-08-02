
import axios from "axios";
import { getAccessToken } from "@/lib/auth";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://fixitnow-backend-gz17.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.error("AUTHENTICATION ERROR:", {
        url: error?.config?.url,
        message: error?.response?.data,
      });
    }

    return Promise.reject(error);
  },
);

export default api;