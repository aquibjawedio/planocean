import { Router } from "express";
import { createProjectNoteController } from "../controllers/projectnote.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const projectNoteRouter = Router();

projectNoteRouter.route("/create-note").post(isLoggedIn, createProjectNoteController);

export { projectNoteRouter };
