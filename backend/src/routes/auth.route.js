import { Router } from "express";
import passport from "passport";

// Imports from folders
import {
  forgotPasswordController,
  googleOAuthSuccessController,
  loginUserController,
  logoutUserController,
  refreshAccessTokenController,
  registerUserController,
  resendVerificationURLController,
  resetPasswordController,
  verifyUserEmailController,
} from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

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


// Google Auth Routes
authRouter.route("/google").get(passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.route("/google/callback").get(
  passport.authenticate("google", {
    failureRedirect: "/api/v1/auth/failure",
    successRedirect: "/api/v1/auth/success",
  })
);
authRouter.route("/success").get(googleOAuthSuccessController);
authRouter.route("/failure").get((req, res) => {
  res.status(401).json({ success: false, message: "Google authentication failed" });
});

export { authRouter };
