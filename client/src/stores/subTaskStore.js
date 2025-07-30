import { axiosClient } from "@/api/axiosClient";
import { create } from "zustand";

const useSubTaskStore = create((set, get) => ({
  subtasks: null,
  subtask: null,
  isLoading: false,
  error: null,

  fetchAllSubTasks: async (projectId, taskId) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosClient.get(
        `/projects/${projectId}/tasks/${taskId}/subtasks`
      );
      set({
        subtasks: res.data.data?.subtasks,
      });
      console.log("Fetched subtasks", get().subtasks);
    } catch (error) {
      console.error("subtasks fetch error:", error);
      set({
        subtasks: null,
        error: "Could not fetch subtasks",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export { useSubTaskStore };
