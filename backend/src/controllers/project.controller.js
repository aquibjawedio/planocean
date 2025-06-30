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

export const createProjectController = asyncHandler(async (req, res) => {
  const userId = req.user?._id.toString();
  const { name, description, createdBy } = createProjectSchema.parse({
    ...req.body,
    createdBy: userId,
  });

  const { project } = await createProjectService({ name, description, createdBy });
  return res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, "Project created successfully", {
      project,
    })
  );
});

export const getAllProjectController = asyncHandler(async (req, res) => {
  const projects = await Project.find({ createdBy: req.user._id.toString() });

  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, "Fetched all project successfully", { projects }));
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
  // get project by id from user loggedin
  const userId = req.user?._id.toString();
  const id = req.params?.projectId;

  const { projectId, name, description, createdBy } = updateProjectSchema.parse({
    projectId: id,
    ...req.body,
    createdBy: userId,
  });

  const { updated, project } = await updateProjectService({
    projectId,
    name,
    description,
    createdBy,
  });

  return res
    .status(HTTP_STATUS.CREATED)
    .json(
      new ApiResponse(HTTP_STATUS.CREATED, "Project updated successfully", { updated, project })
    );
});

export const deleteProjectController = asyncHandler(async (req, res) => {});
