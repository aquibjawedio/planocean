import { ProjectNote } from "../models/projectnote.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createProjectNoteService = async ({ content, project, createdBy }) => {
  const existingProjectNote = await ProjectNote.findOne({ project });
  if (existingProjectNote) {
    throw new ApiError(409, "Project note is already created for this project");
  }

  const projectNote = await ProjectNote.create({ content, project, createdBy });

  if (!projectNote) {
    throw new ApiError(500, "Unable in creating project");
  }
  return { projectNote };
};
