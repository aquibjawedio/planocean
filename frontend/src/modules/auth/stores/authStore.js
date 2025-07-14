import { axiosClient } from "@/api/axiosClient";
import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  loginUser: async (formData) => {
    try {
      const res = await axiosClient.post("/auth/login", formData);
      set({
        user: res.data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      set({ isLoading: false });
    } catch (error) {
      console.log("ERROR IN LOGIN : ", error);
    }
  },
  registerUser: async () => {},
  getCurrentUser: async () => {
    const res = await axiosClient.get("/user/profile");
    if (res.data.success) {
      set({
        user: res.data.data.user,
        isAuthenticated: true,
      });
      return res.data.data.user;
    }
    set({ user: null, isAuthenticated: false });
    return null;
  },
}));

export { useAuthStore };
