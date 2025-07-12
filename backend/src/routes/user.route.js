import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  getCurrentUserController,
  updateUserProfileController,
  updateUserEmailController,
  updateUserPasswordController,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/profile").get(isLoggedIn, getCurrentUserController);
userRouter.route("/profile").patch(isLoggedIn, updateUserProfileController);
userRouter.route("/email").patch(isLoggedIn, updateUserEmailController);
userRouter.route("/password").patch(isLoggedIn, updateUserPasswordController);

export { userRouter };
