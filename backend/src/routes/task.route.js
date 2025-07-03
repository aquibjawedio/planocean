import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { createTaskController, updateTaskController } from "../controllers/task.controller.js";
import { isProjectAdmin } from "../middlewares/subtask.middleware.js";

const taskRouter = Router();

taskRouter.route("/:projectId/create-task").post(isLoggedIn, isProjectAdmin, createTaskController);
taskRouter
  .route("/:projectId/:taskId/update-task")
  .post(isLoggedIn, isProjectAdmin, updateTaskController);

export { taskRouter };
