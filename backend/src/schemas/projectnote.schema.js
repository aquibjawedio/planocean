import { z } from "zod";

export const createProjectNoteSchema = z.object({
  content: z.string().trim().min(1, "Project note is required"),
  project: z.string().trim().min(1, "Project id is required"),
  createdBy: z.string().trim().min(1, "User id is required"),
});
