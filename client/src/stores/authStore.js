import { axiosClient } from "@/api/axiosClient";
import { create } from "zustand";

const useAuthStore = create((set) => {
  const startLoading = () => set({ isLoading: true, error: null });
  const stopLoading = () => set({ isLoading: false });

  const handleError = (error, fallback = "Something went wrong") => {
    const message =
      error?.response?.data?.message || error?.message || fallback;
    set({ error: message });
  };

  const handleSuccess = (response, fallback = "OPERATION SUCCESSFULL") => {
    set({ success: response.data.data.message || fallback });
  };

  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    success: null,

    clearError: () => set({ error: null }),
    clearSuccess: () => set({ success: null }),
    loginUser: async (formData) => {
      try {
        startLoading();
        const res = await axiosClient.post("/auth/login", formData);
        set({
          user: res.data.data.user,
          isAuthenticated: true,
        });
        handleSuccess(res, "Login successful");
      } catch (error) {
        console.error("Login error:", error);
        handleError(error, "Failed to login");
        set({ user: null, isAuthenticated: false });
      } finally {
        stopLoading();
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
      } catch (error) {
        console.error("Avatar update failed:", error);
        set({ error: "Failed to update avatar" });
      } finally {
        set({ isLoading: false });
      }
    },

    registerUser: async (formData) => {
      try {
        set({ isLoading: true, error: null });
        await axiosClient.post("/auth/register", formData);
      } catch (error) {
        console.error("Registration error:", error);
        set({
          user: null,
          isAuthenticated: false,
          error: "Registration failed",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    verifyEmail: async (token) => {
      try {
        set({ isLoading: true });
        await axiosClient.get(`/auth/verify-email/${token}`);
      } catch (error) {
        console.log(`Error in verifying email ${error}`);
        set({ isAuthenticated: false, user: null, error: error });
      } finally {
        set({ isLoading: false });
      }
    },

    resendEmailVerification: async (email) => {
      try {
        set({ isLoading: true, error: null });
        const res = await axiosClient.post("/auth/resend-email", email);
        return res.data.message;
      } catch (error) {
        set({ error: error.response?.data });
        console.log("ERROR  IS => ", error);
        return error;
      } finally {
        set({ isLoading: false });
      }
    },

    sendPasswordResetEmail: async () => {},
    resetPassword: async () => {},
  };
});

export { useAuthStore };
