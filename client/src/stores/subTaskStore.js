import { axiosClient } from "@/api/axiosClient";
import { create } from "zustand";

const useSubTaskStore = create((set, get) => {
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

    createSubtask: async (projectId, taskId, subtaskData) => {
      try {
        startLoading();
        const res = await axiosClient.post(
          `/projects/${projectId}/tasks/${taskId}/subtasks`,
          subtaskData
        );
        handleSuccess(res, "Subtask created successfully");
        set({ subtasks: [...(get().subtasks || []), res.data.data.subtask] });
      } catch (error) {
        console.error("Subtask creation error:", error);
        handleError(error, "Failed to create subtask");
      } finally {
        stopLoading();
      }
    },

    deleteSubtask: async (projectId, taskId, subtaskId) => {
      try {
        startLoading();
        const res = await axiosClient.delete(
          `/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}`
        );
        handleSuccess(res, "Subtask deleted successfully");
        set({
          subtasks: get().subtasks.filter((s) => s._id !== subtaskId),
        });
      } catch (error) {
        console.error("Subtask deletion error:", error);
        handleError(error, "Failed to delete subtask");
      } finally {
        stopLoading();
      }
    },

    completeSubtask: async (projectId, taskId, subtaskId, isCompleted) => {
      try {
        startLoading();
        const res = await axiosClient.patch(
          `/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}`,
          { isCompleted }
        );
        handleSuccess(res, "Subtask updated successfully");
        set({
          subtasks: get().subtasks.map((s) =>
            s._id === subtaskId ? { ...s, isCompleted } : s
          ),
        });
      } catch (error) {
        console.error("Subtask completion error:", error);
        handleError(error, "Failed to update subtask");
      } finally {
        stopLoading();
      }
    },
  };
});

export { useSubTaskStore };
