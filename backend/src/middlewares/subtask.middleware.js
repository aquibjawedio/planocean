import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ProjectMember } from "../models/projectmember.model.js";

export const isProjectAdmin = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id.toString();
  const taskId = req.params?.taskId;
  const projectId = req.params?.projectId;

  if (!projectId || !userId) {
    throw new ApiError(400, "Missing user, task or project ID");
  }

  const membership = await ProjectMember.findOne({ user: userId, project: projectId });

  if (!membership) {
    throw new ApiError(403, "Access Denied! Your are not member of this project");
  }

  const allowedRoles = ["admin", "project_admin"];

  if (!allowedRoles.includes(membership.role)) {
    throw new ApiError(403, "You must be a project admin to perform this action.");
  }
  req.member = {
    user: userId,
    project: projectId,
    task: taskId,
    role: membership.role,
    membershipId: membership._id,
    isAdmin: membership.role === "admin",
    isProjectAdmin: membership.role === "project_admin",
  };

  next();
});

export const isProjectMember = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id.toString();
  const taskId = req.params?.taskId;
  const projectId = req.params?.projectId;

  if (!projectId || !userId) {
    throw new ApiError(400, "Missing user, task or project ID");
  }

  const membership = await ProjectMember.findOne({ user: userId, project: projectId });

  if (membership.role === "member") {
    throw new ApiError(403, "Access Denied! Your are not the member of this project.");
  }
  req.member = {
    user: userId,
    project: projectId,
    task: taskId,
    role: membership.role,
    membershipId: membership._id,
    isMember: membership.role === "member",
  };

  next();
});
