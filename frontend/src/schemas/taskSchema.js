import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["todo", "in-progress", "done"]),
  attachments: z.any().optional(),
  assignedTo: z.string().optional(),
  assignedBy: z.string().optional(),
  project: z.string().optional(),
})
