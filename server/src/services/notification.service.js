import { logger } from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";
import { Notification } from "../models/notification.model.js";

export const getAllNotificationsService = async (userId) => {
  logger.info(`Attemp To Fetch All Notifications For User: ${userId}`);
  const notifications = await Notification.find({
    user: userId,
  }).sort({ createdAt: -1 });

  return notifications;
};

export const markNotificationAsReadService = async (notificationId) => {
  logger.info(
    `Attemp To Mark Notification As Read : Finding notification with id - ${notificationId}`
  );

  const notification = await Notification.findById(notificationId);

  if (!notification) {
    logger.warn(`Failed To Mark Notification Read : Notification not found id - ${notificationId}`);
    throw new ApiError(404, "Notification not found");
  }

  notification.isRead = true;
  const updatedNotification = await notification.save();
  return updatedNotification;
};

export const getUnreadNotificationsService = async (userId) => {
  logger.info(`Attempt To Fetch Unread Notifications For User: ${userId}`);
  const notifications = await Notification.find({
    user: userId,
    isRead: false,
  }).sort({ createdAt: -1 });

  return notifications;
};

export const deleteNotificationService = async (notificationId) => {
  logger.info(`Attempt To Delete Notification with ID: ${notificationId}`);
  const notification = await Notification.findByIdAndDelete(notificationId);
  if (!notification) {
    logger.warn(
      `Failed To Delete Notification: Notification not found with id - ${notificationId}`
    );
    throw new ApiError(404, "Notification not found");
  }
  logger.info(`Notification with ID: ${notificationId} deleted successfully`);

  return "Notification deleted successfully";
};
