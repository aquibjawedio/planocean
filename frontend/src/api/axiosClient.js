import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const axiosClient = axios.create({
  baseURL: `${backendUrl}/api/v1`,
  withCredentials: true,
});

export { axiosClient };
