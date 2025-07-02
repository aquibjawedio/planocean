import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  getCurrentUserController,
  updateUsernameController,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/profile").get(isLoggedIn, getCurrentUserController);
userRouter.route("/update-username").post(isLoggedIn, updateUsernameController);

export { userRouter };
