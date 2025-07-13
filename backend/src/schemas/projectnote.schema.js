import { z } from "zod";

export const createProjectNoteSchema = z.object({
  content: z.string().trim().min(1, "Project note is required"),
  project: z.string().trim().min(1, "Project id is required"),
  createdBy: z.string().trim().min(1, "User id is required"),
});

export const getAllProjectNoteSchema = z.object({
  projectId: z.string().trim().min(1, "Project id is required"),
});

export const getProjectNoteByIdSchema = z.object({
  projectId: z.string().trim().min(1, "Project id is required"),
  noteId: z.string().trim().min(1, "Note id is required"),
});

export const updateProjectNoteSchema = z.object({
  content: z.string().trim().min(1, "Project note is required"),
  noteId: z.string().trim().min(1, "Note id is required"),
});

export const deleteProjectNoteSchema = z.object({
  projectId: z.string().trim().min(1, "Project id is required"),
  noteId: z.string().trim().min(1, "Note id is required"),
  createdBy: z.string().trim().min(1, "User id is required"),
});
