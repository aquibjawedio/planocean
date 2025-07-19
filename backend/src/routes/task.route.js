import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  createTaskController,
  deleteTaskController,
  getAllTaskController,
  getTaskByIdController,
  updatedTaskStatusController,
  updateTaskController,
} from "../controllers/task.controller.js";
import { isProjectAdmin, isProjectMember } from "../middlewares/project.middleware.js";

const taskRouter = Router();

taskRouter.route("/:projectId/tasks").post(isLoggedIn, isProjectAdmin, createTaskController);
taskRouter.route("/:projectId/tasks/:taskId").post(isLoggedIn, isProjectAdmin, updateTaskController);
taskRouter
  .route("/:projectId/tasks/:taskId/status")
  .post(isLoggedIn, isProjectMember, updatedTaskStatusController);
taskRouter.route("/:projectId/tasks").get(isLoggedIn, isProjectMember, getAllTaskController);
taskRouter
  .route("/:projectId/tasks/:taskId")
  .get(isLoggedIn, isProjectMember, getTaskByIdController);
taskRouter
  .route("/:projectId/tasks/:taskId")
  .delete(isLoggedIn, isProjectAdmin, deleteTaskController);

export { taskRouter };
