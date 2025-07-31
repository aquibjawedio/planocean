import { SubTask } from "../models/subtask.model.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

export const createSubTaskService = async ({
  title,
  description,
  isCompleted,
  taskId,
  projectId,
  userId,
}) => {
  logger.info(`Attempting to create subtask for taskId: ${taskId} in projectId: ${projectId}`);

  const subtask = await SubTask.create({
    title,
    description,
    isCompleted,
    task: taskId,
    createdBy: userId,
  });

  if (!subtask) {
    logger.error(`Attempt to create subtask failed for taskId: ${taskId}`);
    throw new ApiError(500, "Failed to create subtask");
  }

  logger.info(`Subtask created successfully with ID: ${subtask._id}`);

  return subtask;
};

export const getAllSubTasksService = async ({ projectId, taskId, userId }) => {
  logger.info(`Fetching all subtasks for taskId: ${taskId}`);

  const subtasks = await SubTask.find({ task: taskId, createdBy: userId });
  if (!subtasks || subtasks.length === 0) {
    logger.warn(`No subtasks found for taskId: ${taskId}`);
    throw new ApiError(404, "No subtasks found for this task");
  }

  logger.info(`Fetched ${subtasks.length} subtasks for taskId: ${taskId}`);

  return subtasks;
};

export const getSubTasksService = async ({ projectId, taskId, userId }) => {
  logger.info(`Attempt to fetch subtask for taskId: ${taskId} in projectId: ${projectId}`);
  const subtask = await SubTask.findOne({ task: taskId, createdBy: userId });

  if (!subtask) {
    logger.warn(`Subtask not found for taskId: ${taskId}`);
    throw new ApiError(404, "Subtask not found");
  }

  logger.info(`Subtask fetched successfully with ID: ${subtask._id}`);
  return subtask;
};

export const deleteSubtaskService = async ({ projectId, taskId, subtaskId, userId }) => {
  logger.info(`Attempting to delete subtask with ID: ${subtaskId} for taskId: ${taskId}`);

  const subtask = await SubTask.findOneAndDelete({
    _id: subtaskId,
    task: taskId,
    createdBy: userId,
  });

  if (!subtask) {
    logger.warn(`Subtask with ID: ${subtaskId} not found for taskId: ${taskId}`);
    throw new ApiError(404, "Subtask not found or you do not have permission to delete it");
  }
  logger.info(`Subtask with ID: ${subtaskId} deleted successfully for taskId: ${taskId}`);
  return `Subtask "${subtask.title}" deleted successfully.`;
};

export const completeSubtaskService = async ({
  projectId,
  taskId,
  subtaskId,
  userId,
  isCompleted,
}) => {
  logger.info(`Attempting to update completion status of subtask with ID: ${subtaskId}`);

  const subtask = await SubTask.findOne({ _id: subtaskId, task: taskId, createdBy: userId });

  if (!subtask) {
    logger.warn(`Subtask with ID: ${subtaskId} not found for taskId: ${taskId}`);
    throw new ApiError(404, "Subtask not found or you do not have permission to update it");
  }

  subtask.isCompleted = isCompleted;
  subtask.updatedAt = new Date();

  const updatedSubtask = await subtask.save();
  if (!updatedSubtask) {
    logger.error(`Failed to update subtask with ID: ${subtaskId}`);
    throw new ApiError(500, "Failed to update subtask");
  }

  logger.info(`Subtask with ID: ${subtaskId} updated successfully`);
  return updatedSubtask;
};

export const updateSubtaskService = async ({
  projectId,
  taskId,
  subtaskId,
  userId,
  title,
  isCompleted,
}) => {
  logger.info(`Attempting to update subtask with ID: ${subtaskId}`);

  const subtask = await SubTask.findOne({ _id: subtaskId, task: taskId, createdBy: userId });
  if (!subtask) {
    logger.warn(`Subtask with ID: ${subtaskId} not found for taskId: ${taskId}`);
    throw new ApiError(404, "Subtask not found or you do not have permission to update it");
  }

  if (title) {
    subtask.title = title;
  }
  if (isCompleted !== undefined) {
    subtask.isCompleted = isCompleted;
  }
  subtask.updatedAt = new Date();
  const updatedSubtask = await subtask.save();

  if (!updatedSubtask) {
    logger.error(`Failed to update subtask with ID: ${subtaskId}`);
    throw new ApiError(500, "Failed to update subtask");
  }
  logger.info(`Subtask with ID: ${subtaskId} updated successfully`);
  return updatedSubtask;
};
