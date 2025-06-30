import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { ProjectNote } from "../models/projectnote.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createProjectNoteService = async ({ content, project, createdBy }) => {
  const existingProjectNote = await ProjectNote.findOne({ project });
  if (existingProjectNote) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "Project note is already created for this project");
  }

  const projectNote = await ProjectNote.create({ content, project, createdBy });

  if (!projectNote) {
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Unable in creating project");
  }
  return { projectNote };
};
