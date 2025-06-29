import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createProjectSchema } from "../schemas/project.schema.js";
import { createProjectService } from "../services/project.service.js";

export const createProjectController = asyncHandler(async (req, res) => {
  const { name, description, createdBy } = createProjectSchema.parse(req.body);

  const { project } = await createProjectService({ name, description, createdBy });
  return res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, "Project created successfully", {
      name,
      description,
      createdBy,
    })
  );
});

export const getAllProjectController = asyncHandler(async (req, res) => {});

export const getProjectByIdController = asyncHandler(async (req, res) => {});

export const updateProjectController = asyncHandler(async (req, res) => {});

export const deleteProjectController = asyncHandler(async (req, res) => {});
