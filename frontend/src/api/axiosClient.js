import axios from "axios";
import { toast } from "sonner";
const server = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const axiosClient = axios.create({
  baseURL: `${server}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axiosClient.post("/auth/refresh-token");
        console.log("Token refreshed successfully");
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        window.location.href = "/auth/login";

        toast("Session expired. Please log in again.", {
          variant: "destructive",
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
        });

        window.location.href = "/auth/login";

        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status >= 500) {
      toast({
        variant: "destructive",
        title: "Server Error",
        description: "Something went wrong on our end. Please try again later.",
      });
    } else if (error.response?.status >= 400) {
      const message = error.response.data?.message || "Something went wrong";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    }

    return Promise.reject(error);
  }
);

export { axiosClient };
