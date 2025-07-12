import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  getCurrentUserController,
  updateUserProfileController,
  updateUserEmailController,
  updateUserPasswordController,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.route("/profile").get(isLoggedIn, getCurrentUserController);
userRouter
  .route("/profile")
  .patch(isLoggedIn, upload.single("avatar"), updateUserProfileController);
userRouter.route("/email").patch(isLoggedIn, updateUserEmailController);
userRouter.route("/password").patch(isLoggedIn, updateUserPasswordController);

export { userRouter };
