import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ProjectMember } from "../models/projectmember.model.js";
import { UserRolesEnum } from "../constants/user.constant.js";
import { logger } from "../utils/logger.js";

export const isProjectAdmin = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id.toString();
  const projectId = req.params?.projectId;

  if (!projectId || !userId) {
    logger.error("Missing project or user ID");
    throw new ApiError(400, "Missing user, task or project ID");
  }

  const membership = await ProjectMember.findOne({ user: userId, project: projectId });

  if (!membership) {
    logger.error("Access Denied! User is not a member of the project");
    throw new ApiError(403, "Access Denied! Your are not member of this project");
  }

  if (membership.role !== UserRolesEnum.PROJECT_ADMIN) {
    logger.error("Access Denied! User is not a project admin");
    throw new ApiError(403, "Access Denied! You are not the project admin.");
  }

  req.membership = membership;

  next();
});

export const isProjectMember = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id.toString();
  const projectId = req.params?.projectId;

  if (!projectId || !userId) {
    logger.error("Missing project or user ID");
    throw new ApiError(400, "Missing user, task or project ID");
  }

  const membership = await ProjectMember.findOne({ user: userId, project: projectId });

  if (!membership) {
    logger.error("Access Denied! User is not a member of the project");
    throw new ApiError(403, "Access Denied! You are not a member of this project");
  }

  if (membership.role !== UserRolesEnum.MEMBER && membership.role !== UserRolesEnum.PROJECT_ADMIN) {
    logger.error("Access Denied! User is not a project member");
    throw new ApiError(403, "Access Denied! You are not a project member.");
  }

  req.membership = membership;

  next();
});
