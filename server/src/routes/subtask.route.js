import { Router } from "express";
import {
  completeSubtaskController,
  createSubTaskController,
  deleteSubtaskController,
  getAllSubTasksController,
  getSubTaskController,
} from "../controllers/subtask.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { isProjectAdmin, isProjectMember } from "../middlewares/project.middleware.js";

const subtaskRouter = Router();

subtaskRouter
  .route("/:projectId/tasks/:taskId/subtasks")
  .post(isLoggedIn, isProjectAdmin, createSubTaskController)
  .get(isLoggedIn, isProjectMember, getAllSubTasksController);

subtaskRouter
  .route("/:projectId/tasks/:taskId/subtasks/:subtaskId")
  .get(isLoggedIn, isProjectMember, getSubTaskController)
  .patch(isLoggedIn, isProjectMember, completeSubtaskController)
  .delete(isLoggedIn, isProjectAdmin, deleteSubtaskController);

export { subtaskRouter };
