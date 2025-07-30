import { axiosClient } from "@/api/axiosClient";
import { create } from "zustand";

const useTaskStore = create((set, get) => ({
  tasks: null,
  task: null,
  isLoading: false,
  error: null,

  fetchAllTasks: async (projectId) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosClient.get(`/projects/${projectId}/tasks`);
      set({
        tasks: res.data.data?.tasks,
      });
    } catch (error) {
      set({
        tasks: null,
        error: error.message || "Could not fetch tasks",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTask: async (projectId, taskId) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosClient.get(
        `/projects/${projectId}/tasks/${taskId}`
      );
      set({
        task: res.data.data?.task,
      });
    } catch (error) {
      set({
        task: null,
        error: error.message || "Could not fetch task",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createTask: async (projectId, taskData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosClient.post(
        `/projects/${projectId}/tasks`,
        taskData
      );
      set({
        tasks: [...get().tasks, res.data.data?.task],
      });
    } catch (error) {
      set({
        error: "Could not create task",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export { useTaskStore };
