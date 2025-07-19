import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:400";

const axiosClient = axios.create({
  baseURL: `${backendUrl}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: `${backendUrl}/api/v1`,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

axiosClient.interceptors.request.use(
  (config) => {
    console.log("request config.url : ", config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error?.response?.status === 401 &&
      error.response.data?.message === "AccessTokenMissing" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosClient(originalRequest));
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshClient.post("/auth/refresh-token");

        failedQueue.forEach(({ resolve }) => resolve());
        failedQueue = [];
        return axiosClient(originalRequest);
      } catch (refreshError) {
        failedQueue.forEach(({ reject }) => reject(refreshError));
        failedQueue = [];

        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export { axiosClient };
