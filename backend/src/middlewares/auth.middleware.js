import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { UserRolesEnum } from "../constants/user.constant.js";
import { verifyJWTAccessToken } from "../utils/jwt.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      throw new ApiError(401, "Unauthorized! Access token missing");
    }

    const decodedUser = verifyJWTAccessToken(accessToken);

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
