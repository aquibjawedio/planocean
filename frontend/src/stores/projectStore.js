import { axiosClient } from "@/api/axiosClient";
import { create } from "zustand";

const useProjectStore = create((set, get) => ({
  projects: null,
  project: null,
  members: null,
  member: null,
  isLoading: false,
  error: null,

  fetchAllProjects: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosClient.get("/projects");
      set({
        projects: res.data.data?.projects,
      });
      console.log("Fetched projects", get().projects);
    } catch (error) {
      console.error("Projects fetch error:", error);
      set({
        projects: null,
        error: "Could not fetch projects",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProject: async (projectId) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosClient.get(`/projects/${projectId}`);
      set({
        project: res.data.data?.project,
      });
      console.log("Fetched project", get().project);
    } catch (error) {
      console.error("Project fetch error:", error);
      set({
        project: null,
        error: "Could not fetch project",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export { useProjectStore };
