import { Router } from "express";
import { createProjectController } from "../controllers/project.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const projectRouter = Router();

projectRouter.route("/create-project").post(isLoggedIn, createProjectController);

export { projectRouter };
