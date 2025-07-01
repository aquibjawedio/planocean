import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createTaskScema } from "../schemas/task.schema.js";
import { createTaskService } from "../services/task.service.js";

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

export const updateTaskController = asyncHandler(async (req, res) => {});

export const deleteTaskController = asyncHandler(async (req, res) => {});

// export const createTaskController = asyncHandler(async (req, res) => {});

// export const createTaskController = asyncHandler(async (req, res) => {});
