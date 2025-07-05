import { Router } from "express";
import {
  addMemberController,
  createProjectController,
  getAllProjectController,
  getProjectByIdController,
  getProjectsCreatedByUserController,
  updateMemberRoleController,
  updateProjectController,
} from "../controllers/project.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { isProjectAdmin } from "../middlewares/subtask.middleware.js";

const projectRouter = Router();

projectRouter.route("/create-project").post(isLoggedIn, createProjectController);
projectRouter.route("/:projectId/add-member").post(isLoggedIn, isProjectAdmin, addMemberController);
projectRouter
  .route("/:projectId/update-role")
  .post(isLoggedIn, isProjectAdmin, updateMemberRoleController);
projectRouter.route("/get-all-projects").get(isLoggedIn, getAllProjectController);
projectRouter.route("/get-created-projects").get(isLoggedIn, getProjectsCreatedByUserController);
projectRouter.route("/get-project/:projectId").get(isLoggedIn, getProjectByIdController);
projectRouter
  .route("/update-project/:projectId")
  .post(isLoggedIn, isProjectAdmin, updateProjectController);

export { projectRouter };
