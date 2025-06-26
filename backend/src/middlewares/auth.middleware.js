import { sanitizeFilter } from "mongoose";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized! Access token missing");
    }

    const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedData) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid access token");
    }

    const user = await User.findById(decodedData._id);
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid access token");
    }

    req.user = sanitizeUser(user);
    next();
  } catch (error) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, error?.message || "Invalid access token", error);
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized request! admin only.");
  }
  next();
});
