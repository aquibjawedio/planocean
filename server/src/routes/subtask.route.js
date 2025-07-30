import { Router } from "express";
import {
  createSubTaskController,
  getSubTasksController,
} from "../controllers/subtask.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { isProjectAdmin, isProjectMember } from "../middlewares/project.middleware.js";

const subtaskRouter = Router();

subtaskRouter
  .route("/:projectId/tasks/:taskId/subtasks")
  .post(isLoggedIn, isProjectAdmin, createSubTaskController);
subtaskRouter
  .route("/:projectId/tasks/:taskId/subtasks")
  .get(isLoggedIn, isProjectMember, getSubTasksController);

export { subtaskRouter };
