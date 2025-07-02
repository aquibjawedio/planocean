import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createTaskScema, updateTaskScema } from "../schemas/task.schema.js";
import { createTaskService, updateTaskService } from "../services/task.service.js";
import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createTaskController = asyncHandler(async (req, res) => {
  const { userId, project, title, description, status, attachments, assignedTo } =
    createTaskScema.parse({
      userId: req.user._id.toString(),
      project: req.params.projectId,
      ...req.body,
    });

  const { task } = await createTaskService({
    userId,
    project,
    title,
    description,
    status,
    attachments,
    assignedTo,
  });

  return res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, "Task created successfully", {
      task,
    })
  );
});

export const updateTaskController = asyncHandler(async (req, res) => {
  const { taskId, userId, project, title, description, status, attachments, assignedTo } =
    updateTaskScema.parse({
      ...req.body,
      taskId: req.params?.taskId,
      userId: req.user?._id.toString(),
    });

  const { updatedTask } = await updateTaskService({
    taskId,
    userId,
    project,
    title,
    description,
    status,
    attachments,
    assignedTo,
  });

  return res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(
      HTTP_STATUS.CREATED,
      "The task was updated successfully and the changes were saved.",
      {
        updatedTask,
      }
    )
  );
});

export const deleteTaskController = asyncHandler(async (req, res) => {});

// export const createTaskController = asyncHandler(async (req, res) => {});

// export const createTaskController = asyncHandler(async (req, res) => {});
