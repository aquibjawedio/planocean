import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { createTaskController } from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.route("/create-task/:projectId").post(isLoggedIn, createTaskController);

export { taskRouter };
