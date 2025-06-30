import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createProjectNoteSchema } from "../schemas/projectnote.schema.js";
import { createProjectNoteService } from "../services/projectnote.service.js";
import { ProjectNote } from "../models/projectnote.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createProjectNoteController = asyncHandler(async (req, res) => {
  const { content, project, createdBy } = createProjectNoteSchema.parse({
    ...req.body,
    createdBy: req.user?._id.toString(),
  });

  const { projectNote } = await createProjectNoteService({ content, project, createdBy });
  return res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, "Note create successfully", {
      projectNote,
    })
  );
});

export const getProjectNoteController = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;
  const projectNote = await ProjectNote.findOne({
    createdBy: req.user._id.toString(),
    project: projectId,
  });

  if (!projectNote) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Project note not found for this project");
  }

  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, "Project Note fetched successfully", { projectNote }));
});

export const updateProjectNoteController = asyncHandler(async (req, res) => {
  const { content, project, createdBy } = createProjectNoteSchema.parse({
    ...req.body,
    createdBy: req.user?._id.toString(),
    project: req.params.projectId,
  });

  const updation = await ProjectNote.updateOne({ project, createdBy }, { $set: { content } });

  if (!updation) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Project note not found for this project");
  }

  const projectNote = await ProjectNote.findOne({ createdBy, project });

  if (!projectNote) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Project Note not found for this project");
  }

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, "Project Note updated successfully", {
        updation,
        projectNote,
      })
    );
});
