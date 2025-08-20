import mongoose, { Schema } from "mongoose";
import {
  AvailableNotificationTypes,
  NotificationTypesEnum,
} from "../constants/notification.constant.js";

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      enum: AvailableNotificationTypes,
      required: true,
      default: NotificationTypesEnum.INFO,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Notification = mongoose.model("Notification", notificationSchema);

export { Notification };
