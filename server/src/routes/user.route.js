import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  getCurrentUserController,
  updateUserProfileController,
  updateUserEmailController,
  updateUserPasswordController,
  updatedUserAvatarController,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.route("/profile").get(isLoggedIn, getCurrentUserController);
userRouter.route("/avatar").patch(isLoggedIn, upload.single("avatar"), updatedUserAvatarController);
userRouter.route("/profile").patch(isLoggedIn, updateUserProfileController);
userRouter.route("/email").patch(isLoggedIn, updateUserEmailController);
userRouter.route("/password").patch(isLoggedIn, updateUserPasswordController);

export { userRouter };  
