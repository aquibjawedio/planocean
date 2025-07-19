import { z } from "zod";

export const createSubTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  isCompleted: z.boolean().default(false),
  taskId: z.string().trim().min(1, "Task ID is required"),
  projectId: z.string().trim().min(1, "Project ID is required"),
  userId: z.string().trim().min(1, "User ID is required"),
});

export const getSubTasksSchema = z.object({
  taskId: z.string().trim().min(1, "Task ID is required"),
  projectId: z.string().trim().min(1, "Project ID is required"),
  userId: z.string().trim().min(1, "User ID is required"),
});
