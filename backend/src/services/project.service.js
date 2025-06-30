import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createProjectService = async ({ name, description, createdBy }) => {
  const project = await Project.create({
    name,
    description,
    createdBy,
  });

  if (!project) {
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Unable to create project");
  }

  return { project };
};

export const updateProjectService = async ({ projectId, name, description, createdBy }) => {
  const updation = await Project.updateOne(
    { _id: projectId, createdBy: createdBy },
    { $set: { name: name, description: description } }
  );

  if (!updation) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Unauthorized or project not found");
  }

  const project = await Project.findOne({ _id: projectId, createdBy: createdBy });
  return { updation, project };
};
