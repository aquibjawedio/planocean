import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  completeSubtaskSchema,
  createSubTaskSchema,
  deleteSubtaskSchema,
  getAllSubTasksSchema,
  getSubTasksSchema,
  updateSubtaskSchema,
} from "../schemas/subtask.schema.js";
import {
  completeSubtaskService,
  createSubTaskService,
  deleteSubtaskService,
  getAllSubTasksService,
  getSubTasksService,
  updateSubtaskService,
} from "../services/subtask.service.js";

export const createSubTaskController = asyncHandler(async (req, res) => {
  const { title, description, isCompleted, projectId, taskId, userId } = createSubTaskSchema.parse({
    ...req.body,
    taskId: req.params.taskId,
    projectId: req.params.projectId,
    userId: req.user._id,
  });

  const subtask = await createSubTaskService({
    title,
    description,
    isCompleted,
    taskId,
    projectId,
    userId,
  });

  return res.status(201).json(
    new ApiResponse(201, "Subtask created successfully", {
      subtask,
    })
  );
});

export const getAllSubTasksController = asyncHandler(async (req, res) => {
  const { projectId, taskId, userId } = getAllSubTasksSchema.parse({
    taskId: req.params.taskId,
    projectId: req.params.projectId,
    userId: req.user._id,
  });

  const subtasks = await getAllSubTasksService({ projectId, taskId, userId });

  return res.status(200).json(
    new ApiResponse(200, "Subtasks fetched successfully", {
      subtasks,
    })
  );
});

export const getSubTaskController = asyncHandler(async (req, res) => {
  const { projectId, taskId, userId } = getSubTasksSchema.parse({
    taskId: req.params.taskId,
    projectId: req.params.projectId,
    userId: req.user._id,
  });

  const subtask = await getSubTasksService({ projectId, taskId, userId });

  return res.status(200).json(
    new ApiResponse(200, "Subtask fetched successfully", {
      subtask,
    })
  );
});

export const deleteSubtaskController = asyncHandler(async (req, res) => {
  const { projectId, taskId, userId, subtaskId } = deleteSubtaskSchema.parse({
    taskId: req.params.taskId,
    projectId: req.params.projectId,
    subtaskId: req.params.subtaskId,
    userId: req.user._id,
  });

  const message = await deleteSubtaskService({ projectId, taskId, userId, subtaskId });

  return res.status(200).json(new ApiResponse(200, message || "Subtask deleted successfully", {}));
});

export const completeSubtaskController = asyncHandler(async (req, res) => {
  const { projectId, taskId, subtaskId, userId, isCompleted } = completeSubtaskSchema.parse({
    taskId: req.params.taskId,
    projectId: req.params.projectId,
    subtaskId: req.params.subtaskId,
    userId: req.user._id,
    ...req.body,
  });

  const subtask = await completeSubtaskService({
    projectId,
    taskId,
    subtaskId,
    userId,
    isCompleted,
  });

  return res.status(200).json(
    new ApiResponse(200, "Subtask completion status updated successfully", {
      subtask,
    })
  );
});

export const updateSubtaskController = asyncHandler(async (req, res) => {
  const { projectId, taskId, subtaskId, userId, title, isCompleted } = updateSubtaskSchema.parse({
    projectId: req.params.projectId,
    taskId: req.params.taskId,
    subtaskId: req.params.subtaskId,
    userId: req.user._id,
    ...req.body,
  });

  const subtask = await updateSubtaskService({
    projectId,
    taskId,
    subtaskId,
    userId,
    title,
    isCompleted,
  });

  return res.status(200).json(
    new ApiResponse(200, "Subtask updated successfully", {
      subtask,
    })
  );
});
