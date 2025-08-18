import { axiosClient } from "@/api/axiosClient";
import { create } from "zustand";

const useProjectStore = create((set, get) => ({
  projects: null,
  project: null,
  members: null,
  member: null,
  isLoading: false,
  error: null,

  createProject: async (formData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosClient.post("/projects", formData);
      set({ projects: [...get().projects, res.data.data.project] });
    } catch (error) {
      console.error("Project creation error:", error);
      set({
        error: "Could not create project",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAllProjects: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosClient.get("/projects");
      set({
        projects: res.data.data?.projects,
      });
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
