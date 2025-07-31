import { ProjectNote } from "../models/projectnote.model.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

export const createProjectNoteService = async ({ content, project, createdBy }) => {
  logger.info(`Creating project note for project: ${project} by user: ${createdBy}`);

  const projectNote = await ProjectNote.create({ content, project, createdBy });

  if (!projectNote) {
    logger.error(`Failed to create note : Unable to proceed note - ${project}`);
    throw new ApiError(500, "Unable in creating project");
  }

  logger.info(`Project Note created successfully : Created by ${createdBy}`);
  return projectNote.populate("createdBy", "fullname username avatarUrl isEmailVerified");
};

export const getAllProjectNoteService = async (projectId) => {
  logger.info(`Attempting to fetch all project notes for project: ${projectId}`);

  const projectNotes = await ProjectNote.find({ project: projectId }).populate(
    "createdBy",
    "fullname username avatarUrl isEmailVerified"
  );

  if (!projectNotes || projectNotes.length === 0) {
    logger.error(`No project notes found for project: ${projectId}`);
    throw new ApiError(404, "No project notes found for this project");
  }

  logger.info(`Fetched ${projectNotes.length} project notes for project: ${projectId}`);
  return projectNotes;
};

export const getProjectNoteByIdService = async (projectId, noteId) => {
  logger.info(`Attempting to fetch project note with ID: ${noteId} for project: ${projectId}`);

  const projectNote = await ProjectNote.findOne({ _id: noteId, project: projectId });

  if (!projectNote) {
    logger.error(`Project note with ID: ${noteId} not found for project: ${projectId}`);
    throw new ApiError(404, "Project note not found for this project");
  }

  logger.info(`Project note with ID: ${noteId} fetched successfully for project: ${projectId}`);
  return projectNote;
};

export const updateProjectNoteService = async ({ content, noteId }) => {
  logger.info(`Attempting to update project note with ID: ${noteId}`);
  const projectNote = await ProjectNote.findById(noteId);

  if (!projectNote) {
    logger.error(`Project note with ID: ${noteId} not found`);
    throw new ApiError(404, "Project note not found");
  }

  projectNote.content = content;
  const updatedNote = await projectNote.save();

  if (!updatedNote) {
    logger.error(`Failed to update project note with ID: ${noteId}`);
    throw new ApiError(500, "Unable to update project note");
  }

  logger.info(`Project note with ID: ${noteId} updated successfully`);

  return updatedNote.populate("createdBy", "fullname username avatarUrl isEmailVerified");
};

export const deleteProjectNoteService = async ({ projectId, noteId, createdBy, role }) => {
  logger.info(
    `Attempting to delete project note with ID: ${noteId} for project: ${projectId} by user: ${createdBy}`
  );

  const noteExists = await ProjectNote.findById(noteId);
  if (!noteExists) {
    logger.error(`Project note with ID: ${noteId} does not exist`);
    throw new ApiError(404, "Project note not found");
  }

  if (noteExists.createdBy.toString() !== createdBy && role !== "project_admin") {
    logger.error(`User: ${createdBy} is not authorized to delete this project note`);
    throw new ApiError(403, "You are not authorized to delete this project note");
  }

  const projectNote = await ProjectNote.findOneAndDelete({
    _id: noteId,
    project: projectId,
  });

  if (!projectNote) {
    logger.error(`Project note with ID: ${noteId} not found for project: ${projectId}`);
    throw new ApiError(404, "Project note not found for this project");
  }

  logger.info(`Project note with ID: ${noteId} deleted successfully for project: ${projectId}`);
  return projectNote;
};
