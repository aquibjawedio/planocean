import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { createTaskController, updateTaskController } from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.route("/create-task/:projectId").post(isLoggedIn, createTaskController);
taskRouter.route("/update-task/:taskId").post(isLoggedIn, updateTaskController);

export { taskRouter };
