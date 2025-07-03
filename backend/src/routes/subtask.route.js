import { Router } from "express";
import { createSubTaskController } from "../controllers/subtask.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { isProjectAdmin } from "../middlewares/subtask.middleware.js";

const subtaskRouter = Router();

subtaskRouter.route("/:projectId/:taskId/create-subtask").post(isLoggedIn, isProjectAdmin, createSubTaskController);

export { subtaskRouter };
