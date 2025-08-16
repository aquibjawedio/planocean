import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]).default("low"),
  dueDate: z.preprocess((val) => {
    if (typeof val === "string" || typeof val === "number")
      return new Date(val);
    return val;
  }, z.date().optional()),
  labels: z.array(z.string()).default([]),
  attachments: z.any().optional(),
  assignedTo: z.string().optional(),
  assignedBy: z.string().optional(),
  project: z.string().optional(),
});
