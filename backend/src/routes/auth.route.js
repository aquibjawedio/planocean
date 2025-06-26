import { Router } from "express";
import {
  getCurrentUserController,
  loginUserController,
  logoutUserController,
  registerUserController,
  resendVerificationURLController,
  verifyUserEmailController,
} from "../controllers/auth.controller.js";
import { isAdmin, isLoggedIn } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.route("/register").post(registerUserController);
authRouter.route("/login").post(loginUserController);
authRouter.route("/logout").post(isLoggedIn, logoutUserController);
authRouter.route("/verify-email/:token").get(verifyUserEmailController);
authRouter.route("/resend-email").post(resendVerificationURLController);
authRouter.route("/me").get(isLoggedIn, getCurrentUserController);

export { authRouter };
