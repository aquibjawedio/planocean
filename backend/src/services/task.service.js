import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
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
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Unable to create task");
  }

  return { task };
};
