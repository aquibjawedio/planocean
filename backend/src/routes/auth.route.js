import { Router } from "express";
import {
  loginUserController,
  logoutUserController,
  registerUserController,
  verifyUserEmailController,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.route("/register").post(registerUserController);
authRouter.route("/login").post(loginUserController);
authRouter.route("/logout").post(logoutUserController);
authRouter.route("/verify-email/:token").post(verifyUserEmailController);


export { authRouter };
