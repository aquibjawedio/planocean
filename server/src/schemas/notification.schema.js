import { z } from "zod";

export const getAllNotificationsSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

export const markNotificationAsReadSchema = z.object({
  notificationId: z.string().trim().min(1, "Notification ID is required"),
});

export const getUnreadNotificationsSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

export const deleteNotificationSchema = z.object({
  notificationId: z.string().trim().min(1, "Notification ID is required"),
});
