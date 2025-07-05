import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  createTaskController,
  deleteTaskController,
  getAllTaskController,
  updatedTaskStatusController,
  updateTaskController,
} from "../controllers/task.controller.js";
import { isProjectAdmin, isProjectMember } from "../middlewares/subtask.middleware.js";

const taskRouter = Router();

taskRouter.route("/:projectId/create-task").post(isLoggedIn, isProjectAdmin, createTaskController);
taskRouter
  .route("/:projectId/:taskId/update-task")
  .post(isLoggedIn, isProjectAdmin, updateTaskController);
taskRouter
  .route("/:projectId/:taskId/update-task-status")
  .post(isLoggedIn, isProjectMember, updatedTaskStatusController);
taskRouter.route("/:projectId/get-all-task").get(isLoggedIn, isProjectMember, getAllTaskController);
taskRouter
  .route("/:projectId/:taskId/delete-task")
  .delete(isLoggedIn, isProjectAdmin, deleteTaskController);

export { taskRouter };
