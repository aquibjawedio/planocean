import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  createProjectSchema,
  getProjectByIdSchema,
  updateProjectSchema,
} from "../schemas/project.schema.js";
import { createProjectService, updateProjectService } from "../services/project.service.js";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ProjectMember } from "../models/projectmember.model.js";

export const createProjectController = asyncHandler(async (req, res) => {
  const userId = req.user?._id.toString();
  const { name, description, createdBy } = createProjectSchema.parse({
    ...req.body,
    createdBy: userId,
  });

  const { project, projectMember } = await createProjectService({ name, description, createdBy });
  return res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, "Project created successfully", {
      project,
      projectMember,
    })
  );
});

export const getAllProjectController = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  const memberships = await ProjectMember.find({ user: userId });
  const memberProjectIds = memberships.map((m) => m.project.toString());

  const projects = await Project.find({
    $or: [{ createdBy: userId }, { _id: { $in: memberProjectIds } }],
  });

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Fetched all project associated with user successfully", {
      projects,
      memberships,
    })
  );
});

export const getProjectsCreatedByUserController = asyncHandler(async (req, res) => {
  const projects = await Project.find({ createdBy: req.user._id.toString() });

  if (!projects) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "No projects found created by user");
  }

  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, "Fetched all projects created by user", { projects }));
});

export const getProjectByIdController = asyncHandler(async (req, res) => {
  const { projectId } = getProjectByIdSchema.parse({ projectId: req.params?.projectId });
  const project = await Project.findOne({ _id: projectId });

  if (!project) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Porject not found with this project id");
  }
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, "Project found with id", { project }));
});

export const updateProjectController = asyncHandler(async (req, res) => {
  const userId = req.user?._id.toString();
  const id = req.params?.projectId;

  const { projectId, name, description, createdBy } = updateProjectSchema.parse({
    projectId: id,
    ...req.body,
    createdBy: userId,
  });

  const { updatedProject } = await updateProjectService({
    projectId,
    name,
    description,
    createdBy,
  });

  return res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, "Project updated successfully", { updatedProject }));
});

export const deleteProjectController = asyncHandler(async (req, res) => {});
