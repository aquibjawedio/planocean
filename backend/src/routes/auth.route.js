import { Router } from "express";
import {
  forgotPasswordController,
  getCurrentUserController,
  loginUserController,
  logoutUserController,
  refreshAccessTokenController,
  registerUserController,
  resendVerificationURLController,
  resetPasswordController,
  updateUsernameController,
  verifyUserEmailController,
} from "../controllers/auth.controller.js";
import { isAdmin, isLoggedIn } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.route("/register").post(registerUserController);
authRouter.route("/login").post(loginUserController);
authRouter.route("/verify-email/:token").get(verifyUserEmailController);
authRouter.route("/resend-email").post(resendVerificationURLController);
authRouter.route("/refresh-access-token").post(refreshAccessTokenController);
authRouter.route("/forgot-password").post(forgotPasswordController);
authRouter.route("/reset-password/:token").post(resetPasswordController);

// Login Only Routes
authRouter.route("/logout").post(isLoggedIn, logoutUserController);
authRouter.route("/me").get(isLoggedIn, getCurrentUserController);
authRouter.route("/update-username").post(isLoggedIn, updateUsernameController);

// Admin Only Routes

export { authRouter };
