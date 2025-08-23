import { NotificationTypesEnum } from "../constants/notification.constant.js";
import { isProjectAdmin } from "../middlewares/project.middleware.js";
import { Notification } from "../models/notification.model.js";
import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createTaskService = async ({
  userId,
  project,
  title,
  description,
  status,
  priority,
  dueDate,
  labels = [],
  attachments,
  assignedTo,
}) => {
  const task = await Task.create({
    project,
    title,
    description,
    status,
    priority,
    dueDate: dueDate ? new Date(dueDate) : null,
    labels,
    attachments,
    assignedTo,
    assignedBy: userId,
  });

  if (!task) {
    throw new ApiError(500, "Unable to create task");
  }

  await Notification.create({
    user: assignedTo,
    content: `New task "${title}" has been assigned to you.`,
    type: NotificationTypesEnum.INFO,
    project,
  });

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

  await Notification.create({
    user: assignedTo,
    content: `Task "${title}" has been updated.`,
    type: NotificationTypesEnum.INFO,
    project,
  });

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

  if (task.assignedTo.toString() !== userId && !isProjectAdmin) {
    throw new ApiError(401, "Unauthorized! Task is not assigned to you.");
  }

  task.status = status;
  await task.save();
  await task.populate("assignedTo", "fullname username avatarUrl isEmailVerified");
  await task.populate("assignedBy", "fullname username avatarUrl isEmailVerified");

  await Notification.create({
    user: task.assignedTo,
    content: `Task "${task.title}" status has been updated to ${status}.`,
    type: NotificationTypesEnum.INFO,
    project: projectId,
  });

  return { task };
};
