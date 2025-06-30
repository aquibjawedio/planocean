import { Router } from "express";
import {
  createProjectController,
  getAllProjectController,
  getProjectByIdController,
  updateProjectController,
} from "../controllers/project.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const projectRouter = Router();

projectRouter.route("/create-project").post(isLoggedIn, createProjectController);
projectRouter.route("/get-all-projects").get(isLoggedIn, getAllProjectController);
projectRouter.route("/get-project/:projectId").get(isLoggedIn, getProjectByIdController);
projectRouter.route("/update-project/:projectId").post(isLoggedIn, updateProjectController);

export { projectRouter };
