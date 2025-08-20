import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteNotificationSchema,
  getAllNotificationsSchema,
  getUnreadNotificationsSchema,
  markNotificationAsReadSchema,
} from "../schemas/notification.schema.js";
import {
  deleteNotificationService,
  getAllNotificationsService,
  getUnreadNotificationsService,
  markNotificationAsReadService,
} from "../services/notification.service.js";

export const getAllNotificationsController = asyncHandler(async (req, res) => {
  const { userId } = getAllNotificationsSchema.parse({ userId: req.user._id });
  const notifications = await getAllNotificationsService(userId);
  return res
    .status(200)
    .json(new ApiResponse(200, "All notifications for user fetched", { notifications }));
});

export const markNotificationAsReadController = asyncHandler(async (req, res) => {
  const { notificationId } = markNotificationAsReadSchema.parse({
    notificationId: req.params.notificationId,
  });

  const notification = await markNotificationAsReadService(notificationId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Notification marked as read", { notification }));
});

export const getUnreadNotificationsController = asyncHandler(async (req, res) => {
  const { userId } = getUnreadNotificationsSchema.parse({ userId: req.user._id });
  const notifications = await getUnreadNotificationsService(userId);
  return res
    .status(200)
    .json(new ApiResponse(200, "Unread notifications count fetched", { notifications }));
});

export const deleteNotificationController = asyncHandler(async (req, res) => {
  const { notificationId } = deleteNotificationSchema.parse({
    notificationId: req.params.notificationId,
  });

  const result = await deleteNotificationService(notificationId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Notification deleted successfully", { result }));
});
