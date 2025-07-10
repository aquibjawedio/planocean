import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  updatedTaskStatusSchema,
  createTaskSchema,
  updateTaskSchema,
  getAllTaskSchema,
  deleteTaskSchema,
  getTaskByIdSchema,
} from "../schemas/task.schema.js";
import {
  createTaskService,
  updatedTaskStatusService,
  updateTaskService,
} from "../services/task.service.js";
import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createTaskController = asyncHandler(async (req, res) => {
  const { userId, project, title, description, status, attachments, assignedTo } =
    createTaskSchema.parse({
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

  return res.status(201).json(
    new ApiResponse(201, "Task created successfully", {
      task,
    })
  );
});

export const getAllTaskController = asyncHandler(async (req, res) => {
  const { projectId } = getAllTaskSchema.parse({ projectId: req.params.projectId });

  const tasks = await Task.find({ project: projectId });

  return res.status(200).json(new ApiResponse(200, "All tasks fetched successfully", { tasks }));
});

export const getTaskByIdController = asyncHandler(async (req, res) => {
  const { taskId } = getTaskByIdSchema.parse({ taskId: req.params.taskId });
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found! Invalid task id");
  }

  return res.status(200).json(new ApiResponse(200, "Task fetched by id successfully", { task }));
});

export const updateTaskController = asyncHandler(async (req, res) => {
  const { taskId, userId, project, title, description, status, attachments, assignedTo } =
    updateTaskSchema.parse({
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

  return res.status(201).json(
    new ApiResponse(201, "The task was updated successfully and the changes were saved.", {
      updatedTask,
    })
  );
});

export const updatedTaskStatusController = asyncHandler(async (req, res) => {
  const { taskId, userId, projectId, status } = updatedTaskStatusSchema.parse({
    ...req.body,
    userId: req.user?._id.toString(),
    projectId: req.params.projectId,
    taskId: req.params.taskId,
  });

  const { task } = await updatedTaskStatusService({ taskId, userId, projectId, status });

  return res.status(201).json(
    new ApiResponse(201, "Task status updated successfully", {
      task,
    })
  );
});

export const deleteTaskController = asyncHandler(async (req, res) => {
  const { projectId, taskId } = deleteTaskSchema.parse({
    projectId: req.params.projectId,
    taskId: req.params.taskId,
  });

  const deletedTask = await Task.findByIdAndDelete(taskId);

  if (!deletedTask) {
    throw new ApiError(404, "Task not found, invalid task id");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Task deleted successfully", { task: deletedTask }));
});
