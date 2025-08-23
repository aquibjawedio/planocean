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
taskRouter
  .route("/:projectId/tasks/:taskId")
  .post(isLoggedIn, isProjectAdmin, updateTaskController)
  .patch(isLoggedIn, isProjectAdmin, updatedTaskStatusController)
  .delete(isLoggedIn, isProjectAdmin, deleteTaskController);

taskRouter.route("/:projectId/tasks").get(isLoggedIn, isProjectMember, getAllTaskController);
taskRouter
  .route("/:projectId/tasks/:taskId")
  .get(isLoggedIn, isProjectMember, getTaskByIdController);

export { taskRouter };
