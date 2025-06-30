import { Router } from "express";
import {
  createProjectNoteController,
  getProjectNoteController,
  updateProjectNoteController,
} from "../controllers/projectnote.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const projectNoteRouter = Router();

projectNoteRouter.route("/create-note").post(isLoggedIn, createProjectNoteController);
projectNoteRouter.route("/get-note/:projectId").get(isLoggedIn, getProjectNoteController);
projectNoteRouter.route("/update-note/:projectId").post(isLoggedIn, updateProjectNoteController);

export { projectNoteRouter };
