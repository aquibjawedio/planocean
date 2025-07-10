import { isProjectAdmin } from "../middlewares/subtask.middleware.js";
import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createTaskService = async ({
  userId,
  project,
  title,
  description,
  status,
  attachments,
  assignedTo,
}) => {
  const task = await Task.create({
    project,
    title,
    description,
    status,
    attachments,
    assignedTo,
    assignedBy: userId,
  });

  if (!task) {
    throw new ApiError(500, "Unable to create task");
  }

  return { task };
};

export const getAllTaskService = async ({}) => {};

export const updateTaskService = async ({
  taskId,
  userId,
  project,
  title,
  description,
  status,
  attachments,
  assignedTo,
}) => {
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      title,
      description,
      status,
      attachments,
      assignedTo,
      project,
      assignedBy: userId,
    },
    { new: true, runValidators: true }
  );

  if (!updatedTask) {
    throw new ApiError(
      500,
      "Failed to update the task. Please check the task ID or provided data."
    );
  }

  return { updatedTask };
};

export const updatedTaskStatusService = async ({ taskId, userId, projectId, status }) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found, invalid task id.");
  }

  if (task.status == status) {
    throw new ApiError(400, "No changes in status ");
  }

  if (task.assignedTo.toString() !== userId || !isProjectAdmin) {
    throw new ApiError(401, "Unauthorized! Task is not assigned to you.");
  }

  task.status = status;
  await task.save();
  return { task };
};
