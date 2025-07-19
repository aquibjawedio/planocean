import { axiosClient } from "@/api/axiosClient";
import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  loginUser: async (formData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosClient.post("/auth/login", formData, {
        withCredentials: true,
      });
      set({
        user: res.data.data.user,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Login error:", error);
      set({ user: null, isAuthenticated: false, error: "Login failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosClient.get("/user/profile");
      set({
        user: res.data.data?.user,
        isAuthenticated: true,
      });
      console.log("Fetched user profile:", get().user);
    } catch (error) {
      console.error("Profile fetch error:", error);
      set({
        user: null,
        isAuthenticated: false,
        error: "Could not fetch profile",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  logoutUser: async () => {
    try {
      set({ isLoading: true, error: null });
      await axiosClient.post("/auth/logout");
      console.log("User logged out successfully");
      set({ user: null, isAuthenticated: false, error: null });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        error: error.message || "Logout failed",
      });
      console.error("Logout failed:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserAvatar: async (file) => {
    try {
      set({ isLoading: true, error: null });
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await axiosClient.patch("/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ user: res.data.data.user });
      console.log("Avatar updated successfully");
    } catch (error) {
      console.error("Avatar update failed:", error);
      set({ error: "Failed to update avatar" });
    } finally {
      set({ isLoading: false });
    }
  },

  registerUser: async () => {},
  sendPasswordResetEmail: async () => {},
  resetPassword: async () => {},
  sendEmailVerification: async () => {},
  verifyEmail: async () => {},
}));

export { useAuthStore };
