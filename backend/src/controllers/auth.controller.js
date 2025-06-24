import { loginUserSchema, registerUserSchema } from "../schemas/auth.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { loginUserService, registerUserService } from "../services/auth.service.js";
import { ApiError } from "../utils/ApiError.js";

export const registerUserController = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = registerUserSchema.parse(req.body);

  const user = await registerUserService(fullname, username, email, password);

  return res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, "User registered successfully", user));
});

export const loginUserController = asyncHandler(async (req, res) => {
  if (req.cookies?.refreshToken) {
    console.log(req.cookies?.refreshToken);
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "User is already loggedin");
  }
  const { email, password } = loginUserSchema.parse(req.body);

  const { user, accessToken, refreshToken } = await loginUserService(email, password);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    samesite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, "User loggedin successfully", { user, accessToken }));
});

export const logoutUserController = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "User is already logged out");
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    samesite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, "User logged out successfully"));
});

export const verifyUserEmailController = asyncHandler(async (req, res) => {
  
});

export const resendVerificationURLController = asyncHandler(async (req, res) => {});

export const refreshAccessTokenController = asyncHandler(async (req, res) => {});

export const getCurrentUserController = asyncHandler(async (req, res) => {});
