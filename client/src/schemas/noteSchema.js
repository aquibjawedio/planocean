import { z } from "zod";

export const noteSchema = z.object({
  content: z.string().min(1, "Note content is required"),
});

export const editNoteSchema = z.object({
  content: z.string().min(1, "Note content is required."),
  projectId: z.string().min(1),
});
