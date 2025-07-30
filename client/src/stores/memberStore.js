import { axiosClient } from "@/api/axiosClient";
import { create } from "zustand";

const useMemberStore = create((set, get) => {
  const startLoading = () =>
    set({ isLoading: true, error: null, success: null });
  const stopLoading = () => set({ isLoading: false });

  const handleError = (error) => set({ error, success: null });
  const handleSuccess = (message) => set({ success: message, error: null });

  return {
    members: null,
    member: null,
    isLoading: false,
    error: null,
    success: null,

    addMember: async ({ projectId, formData }) => {
      startLoading();
      try {
        const response = await axiosClient.post(
          `/projects/${projectId}/members`,
          formData
        );
        console.log("Added Member  :", response.data.data?.member);
        const newMember = response.data.data?.member;
        const currentMembers = get().members || [];

        set({
          members: [...currentMembers, newMember],
          error: null,
        });
        handleSuccess("Member added successfully");
        console.log("Members after addition:", get().members);
      } catch (error) {
        handleError(error.message);
      } finally {
        stopLoading();
      }
    },

    fetchAllMembers: async (projectId) => {
      startLoading();
      try {
        const response = await axiosClient.get(
          `/projects/${projectId}/members`
        );
        console.log("Fetched ALL Members IN fetchAllMembers:", response);
        set({ members: response.data.data?.members, error: null });
        handleSuccess("Members fetched successfully");
      } catch (error) {
        console.error("Error fetching members:", error);
        handleError(error.message);
      } finally {
        stopLoading();
      }
    },

    removeMember: async ({ projectId, memberId }) => {
      startLoading();
      try {
        const response = await axiosClient.delete(
          `/projects/${projectId}/members/${memberId}`
        );
        console.log("Removed Member:", response.data.data?.member);
        const updatedMembers = get().members.filter(
          (member) => member._id !== memberId
        );
        set({ members: updatedMembers, error: null });
        handleSuccess("Member removed successfully");
      } catch (error) {
        console.error("Error removing member:", error);
        handleError(error.message);
      } finally {
        stopLoading();
      }
    },
  };
});

export { useMemberStore };
