import { Router } from "express";
import {
  createProjectNoteController,
  deleteProjectNoteController,
  getAllProjectNoteController,
  getProjectNoteByIdController,
  updateProjectNoteController,
} from "../controllers/projectnote.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { isProjectMember } from "../middlewares/project.middleware.js";

const projectNoteRouter = Router();

projectNoteRouter
  .route("/:projectId/notes")
  .post(isLoggedIn, isProjectMember, createProjectNoteController);
projectNoteRouter
  .route("/:projectId/notes")
  .get(isLoggedIn, isProjectMember, getAllProjectNoteController);

projectNoteRouter
  .route("/:projectId/notes/:noteId")
  .get(isLoggedIn, isProjectMember, getProjectNoteByIdController);

projectNoteRouter
  .route("/:projectId/notes/:noteId")
  .patch(isLoggedIn, isProjectMember, updateProjectNoteController);

projectNoteRouter
  .route("/:projectId/notes/:noteId")
  .delete(isLoggedIn, isProjectMember, deleteProjectNoteController);

export { projectNoteRouter };
