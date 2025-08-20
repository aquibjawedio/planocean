import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  deleteNotificationController,
  getAllNotificationsController,
  getUnreadNotificationsController,
  markNotificationAsReadController,
} from "../controllers/notification.controller.js";

const notificationRouter = Router();

notificationRouter.route("/").get(isLoggedIn, getAllNotificationsController);
notificationRouter.route("/unread").get(isLoggedIn, getUnreadNotificationsController);
notificationRouter
  .route("/:notificationId")
  .patch(isLoggedIn, markNotificationAsReadController)
  .delete(isLoggedIn, deleteNotificationController);

export { notificationRouter };
