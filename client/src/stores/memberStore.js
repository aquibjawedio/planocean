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
        const newMember = response.data.data?.member;
        const currentMembers = get().members || [];

        set({
          members: [...currentMembers, newMember],
          error: null,
        });
        handleSuccess("Member added successfully");
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
        await axiosClient.delete(`/projects/${projectId}/members/${memberId}`);
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

    editMemberRole: async ({ projectId, memberId, role }) => {
      startLoading();
      try {
        await axiosClient.patch(`/projects/${projectId}/members/${memberId}`, {
          role,
        });
        const updatedMembers = get().members.map((member) =>
          member._id === memberId ? { ...member, role } : member
        );
        set({ members: updatedMembers, error: null });
        handleSuccess("Member role updated successfully");
      } catch (error) {
        console.error("Error updating member role:", error);
        handleError(error.message);
      } finally {
        stopLoading();
      }
    },
  };
});

export { useMemberStore };
