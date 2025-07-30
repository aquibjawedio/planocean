import { axiosClient } from "@/api/axiosClient";
import { create } from "zustand";

export const useNoteStore = create((set, get) => {
  const startLoading = () =>
    set({ isLoading: true, error: null, success: null });
  const stopLoading = () => set({ isLoading: false });

  const handleError = (error) => set({ error, success: null });
  const handleSuccess = (message) => set({ success: message, error: null });

  return {
    notes: null,
    isLoading: false,
    error: null,
    success: null,

    fetchAllNotes: async (projectId) => {
      startLoading();
      try {
        const response = await axiosClient.get(`/projects/${projectId}/notes`);
        set({ notes: response.data.data?.notes, error: null });
      } catch (error) {
        handleError(error.message);
      } finally {
        stopLoading();
      }
    },

    createNote: async (projectId, noteData) => {
      startLoading();
      try {
        const response = await axiosClient.post(
          `/projects/${projectId}/notes`,
          noteData
        );
        set({
          notes: [...(get().notes || []), response.data.data?.projectNote],
          error: null,
        });
        handleSuccess("Note created successfully");
      } catch (error) {
        handleError(error.message);
      } finally {
        stopLoading();
      }
    },
  };
});
