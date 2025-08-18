import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  createProjectNoteSchema,
  deleteProjectNoteSchema,
  getAllProjectNoteSchema,
  getProjectNoteByIdSchema,
  updateProjectNoteSchema,
} from "../schemas/projectnote.schema.js";
import {
  createProjectNoteService,
  deleteProjectNoteService,
  getAllProjectNoteService,
  getProjectNoteByIdService,
  updateProjectNoteService,
} from "../services/projectnote.service.js";

export const createProjectNoteController = asyncHandler(async (req, res) => {
  const { content, project, createdBy } = createProjectNoteSchema.parse({
    ...req.body,
    project: req.params.projectId,
    createdBy: req.user?._id.toString(),
  });

  const projectNote = await createProjectNoteService({ content, project, createdBy });

  const io = req.app.get("io");
  io.to(project.toString()).emit("note", {
    message: `${projectNote.createdBy.fullname} created a new note in project ${projectNote.project.name}`,
    projectId: project,
    userId: createdBy,
  });

  return res.status(201).json(
    new ApiResponse(201, "Project Note create successfully", {
      projectNote,
    })
  );
});

export const getAllProjectNoteController = asyncHandler(async (req, res) => {
  const { projectId } = getAllProjectNoteSchema.parse({ projectId: req.params.projectId });

  const notes = await getAllProjectNoteService(projectId);

  return res.status(200).json(
    new ApiResponse(200, "Project Notes fetched successfully", {
      notes,
    })
  );
});

export const getProjectNoteByIdController = asyncHandler(async (req, res) => {
  const { projectId, noteId } = getProjectNoteByIdSchema.parse({
    projectId: req.params.projectId,
    noteId: req.params.noteId,
  });

  const note = await getProjectNoteByIdService(projectId, noteId);

  return res.status(200).json(
    new ApiResponse(200, "Project Note fetched successfully", {
      note,
    })
  );
});

export const updateProjectNoteController = asyncHandler(async (req, res) => {
  const { content, noteId } = updateProjectNoteSchema.parse({
    ...req.body,
    noteId: req.params.noteId,
  });

  const note = await updateProjectNoteService({ content, noteId });

  return res.status(200).json(
    new ApiResponse(200, "Project Note updated successfully", {
      note,
    })
  );
});

export const deleteProjectNoteController = asyncHandler(async (req, res) => {
  const { projectId, noteId, createdBy } = deleteProjectNoteSchema.parse({
    projectId: req.params.projectId,
    noteId: req.params.noteId,
    createdBy: req.user?._id.toString(),
  });

  const note = await deleteProjectNoteService({
    projectId,
    noteId,
    createdBy,
    role: req.membership.role,
  });

  return res.status(200).json(
    new ApiResponse(200, "Project Note deleted successfully", {
      note,
    })
  );
});
