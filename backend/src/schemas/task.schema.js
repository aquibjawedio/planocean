import { z } from "zod";
import { AvailableTaskStatus } from "../constants/task.constant.js";

export const createTaskSchema = z.object({
  userId: z.string().trim().min(1, "User id is required"),
  project: z.string().trim().min(1, "Project id is required"),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(500, "Description cannot exceed 500 characters"),
  status: z
    .enum(AvailableTaskStatus, {
      required_error: "Status is required",
      invalid_type_error: "Status must be one of TODO, IN_PROGRESS, or DONE",
    })
    .default("todo"),
  attachments: z.array(
    z.object({
      url: z.string().url("Invalid URL format").optional(),
      mimetype: z.string().optional(),
      size: z.number().optional(),
    })
  ),
  assignedTo: z.string().trim().min(1, "Assigned user id is required"),
});

export const updateTaskSchema = z.object({
  taskId: z.string().trim().min(1, "Task id is required"),
  userId: z.string().trim().min(1, "User id is required"),
  project: z.string().trim().min(1, "Project id is required"),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(500, "Description cannot exceed 500 characters"),
  status: z
    .enum(AvailableTaskStatus, {
      required_error: "Status is required",
      invalid_type_error: "Status must be one of TODO, IN_PROGRESS, or DONE",
    })
    .default("todo"),
  attachments: z.array(
    z.object({
      url: z.string().url("Invalid URL format").optional(),
      mimetype: z.string().optional(),
      size: z.number().optional(),
    })
  ),
  assignedTo: z.string().trim().min(1, "Assigned user id is required"),
});

export const updatedTaskStatusSchema = z.object({
  status: z
    .enum(AvailableTaskStatus, {
      required_error: "Status is required",
      invalid_type_error: "Status must be one of TODO, IN_PROGRESS, or DONE",
    })
    .default("todo"),
  taskId: z.string().trim().min(1, "Task id is required"),
  userId: z.string().trim().min(1, "User id is required"),
  projectId: z.string().trim().min(1, "Project id is required"),
});

export const getAllTaskSchema = z.object({
  projectId: z.string().trim().min(1, "Project id is required"),
});

export const deleteTaskSchema = z.object({
  taskId: z.string().trim().min(1, "Task id is required"),
  projectId: z.string().trim().min(1, "Project id is required"),
});

export const getTaskByIdSchema = z.object({
  taskId: z.string().trim().min(1, "Task id is required"),
});
