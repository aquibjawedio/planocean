import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { createTaskController, updateTaskController } from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.route("/:projectId/create-task").post(isLoggedIn, createTaskController);
taskRouter.route("/:projectId/:taskId/update-task").post(isLoggedIn, updateTaskController);

export { taskRouter };
