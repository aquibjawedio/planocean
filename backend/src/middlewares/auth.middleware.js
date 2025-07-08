import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized! Access token missing");
    }

    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decodedUser : ", decodedUser);
    if (!decodedUser) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid access token");
    }

    req.user = decodedUser;
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
