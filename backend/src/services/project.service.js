import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ProjectMember } from "../models/projectmember.model.js";
import { UserRolesEnum } from "../constants/user.constant.js";

export const createProjectService = async ({ name, description, createdBy }) => {
  const existingProject = await Project.findOne({ name });
  if (existingProject) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "Project already exists with this name, please choose other name"
    );
  }
  const project = await Project.create({
    name,
    description,
    createdBy,
  });

  if (!project) {
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Unable to create project");
  }

  const projectMember = await ProjectMember.create({
    project: project._id,
    role: UserRolesEnum.PROJECT_ADMIN,
    user: createdBy,
  });

  if (!projectMember) {
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Unable to create projectMember");
  }

  return { project, projectMember };
};

export const updateProjectService = async ({ projectId, name, description, createdBy }) => {
  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { name, description },
    { new: true, runValidators: true }
  );

  if (!updatedProject) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Unauthorized or project not found");
  }

  return { updatedProject };
};
