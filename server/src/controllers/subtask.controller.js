import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { SubTask } from "../models/subtask.model.js";
import { createSubTaskSchema, getSubTasksSchema } from "../schemas/subtask.schema.js";

export const createSubTaskController = asyncHandler(async (req, res) => {
  const { title, description, isCompleted, projectId, taskId, userId } = createSubTaskSchema.parse({
    ...req.body,
    taskId: req.params.taskId,
    projectId: req.params.projectId,
    userId: req.user._id,
  });

  const subtask = await SubTask.create({
    title,
    description,
    isCompleted,
    task: taskId,
    project: projectId,
    createdBy: userId,
  });

  if (!subtask) {
    throw new ApiError(500, "Failed to create subtask");
  }

  return res.status(201).json(
    new ApiResponse(201, "Subtask created successfully", {
      subtask,
    })
  );
});

export const getSubTasksController = asyncHandler(async (req, res) => {
  const { projectId, taskId } = getSubTasksSchema.parse({
    taskId: req.params.taskId,
    projectId: req.params.projectId,
    userId: req.user._id.toString(),
  });

  const subtasks = await SubTask.find({ task: taskId });

  if (!subtasks || subtasks.length === 0) {
    throw new ApiError(404, "No subtasks found for this task");
  }

  return res.status(200).json(
    new ApiResponse(200, "Subtasks fetched successfully", {
      subtasks,
    })
  );
});
