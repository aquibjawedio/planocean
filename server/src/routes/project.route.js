import { Router } from "express";
import {
  addProjectMemberController,
  createProjectController,
  deleteProjectController,
  getAllProjectMembersController,
  getAllProjectsController,
  getProjectByIdController,
  removeProjectMemberController,
  updateMemberRoleController,
  updateProjectController,
} from "../controllers/project.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { isProjectAdmin, isProjectMember } from "../middlewares/project.middleware.js";

const projectRouter = Router();

projectRouter.route("/").post(isLoggedIn, createProjectController);
projectRouter.route("/").get(isLoggedIn, getAllProjectsController);

projectRouter.route("/:projectId").get(isLoggedIn, isProjectMember, getProjectByIdController);
projectRouter.route("/:projectId").patch(isLoggedIn, isProjectAdmin, updateProjectController);

projectRouter
  .route("/:projectId/members")
  .post(isLoggedIn, isProjectAdmin, addProjectMemberController);

projectRouter
  .route("/:projectId/members/:memberId")
  .delete(isLoggedIn, isProjectAdmin, removeProjectMemberController);

projectRouter
  .route("/:projectId/members")
  .get(isLoggedIn, isProjectMember, getAllProjectMembersController);

projectRouter
  .route("/:projectId/members/:memberId")
  .patch(isLoggedIn, isProjectAdmin, updateMemberRoleController);

projectRouter.route("/:projectId").delete(isLoggedIn, isProjectAdmin, deleteProjectController);

export { projectRouter };
