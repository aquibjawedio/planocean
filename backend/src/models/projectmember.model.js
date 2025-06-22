import mongoose, { Schema } from "mongoose";
import { AvailableUserRoles, UserRolesEnum } from "../constants/user.constant.js";

const projectmemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: UserRolesEnum.MEMBER,
    },
  },
  { timestamps: true, versionKey: false }
);

const ProjectMember = mongoose.model("ProjectMember", projectmemberSchema);

export { ProjectMember };
