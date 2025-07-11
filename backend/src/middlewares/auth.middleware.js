import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { UserRolesEnum } from "../constants/user.constant.js";
import { env } from "../config/env.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new ApiError(401, "Unauthorized! Access token missing");
    }

    const decodedUser = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

    if (!decodedUser) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = decodedUser;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token", error);
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== UserRolesEnum.ADMIN) {
    throw new ApiError(401, "Unauthorized request! admin only.");
  }
  next();
});
