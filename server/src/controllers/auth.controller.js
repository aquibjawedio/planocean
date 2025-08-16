import {
  forgotPasswordSchema,
  loginUserSchema,
  logoutUserSchema,
  registerUserSchema,
  resendVerificationURLSchema,
  resetPasswordSchema,
  verifyUserEmailSchema,
} from "../schemas/auth.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  forgotPasswordService,
  loginUserService,
  loginWithGoogleService,
  logoutUserService,
  refreshAccessTokenService,
  registerUserService,
  resendVerificationURLService,
  resetPasswordService,
  verifyUserEmailService,
} from "../services/auth.service.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

export const registerUserController = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = registerUserSchema.parse(req.body);

  const user = await registerUserService(fullname, username, email, password);

  return res.status(201).json(new ApiResponse(201, "User registered successfully", user));
});

export const loginUserController = asyncHandler(async (req, res) => {
  if (req.cookies?.refreshToken) {
    logger.warn("User is already logged in, cannot login again");
    throw new ApiError(401, "User is already loggedin");
  }
  const { email, password } = loginUserSchema.parse(req.body);

  const device = req.headers["user-agent"];
  const ipAddress = req.ip;

  const { user, accessToken, accessCookieOptions, refreshToken, refreshCookieOptions } =
    await loginUserService(email, password, device, ipAddress);

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, refreshCookieOptions)
    .cookie("accessToken", accessToken, accessCookieOptions)
    .json(new ApiResponse(200, "User loggedin successfully", { user }));
});

export const logoutUserController = asyncHandler(async (req, res) => {
  const { token } = logoutUserSchema.parse({ token: req.cookies?.refreshToken });

  const options = await logoutUserService(token);

  res.clearCookie("refreshToken", options);
  res.clearCookie("accessToken", options);

  logger.info(`Logout successful: All cookies cleared for user - ${req.user}`);
  res
    .status(200)
    .json(new ApiResponse(200, "User logged out successfully", { user: sanitizeUser(req.user) }));
});

export const verifyUserEmailController = asyncHandler(async (req, res) => {
  const { token } = verifyUserEmailSchema.parse({ token: req.params?.token });

  if (!token) {
    throw new ApiError(404, "Token not found");
  }
  const user = await verifyUserEmailService(token);
  res.status(200).json(new ApiResponse(200, "User email verification successfull", { user }));
});

export const resendVerificationURLController = asyncHandler(async (req, res) => {
  const { email } = resendVerificationURLSchema.parse(req.body);

  const user = await resendVerificationURLService(email);

  return res.status(200).json(
    new ApiResponse(200, "Email sent successfully, please check your inbox or spam folder", {
      user,
    })
  );
});

export const refreshAccessTokenController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    logger.warn("Refresh token is missing or invalid");
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    throw new ApiError(401, "Unauthorized! Refresh token missing");
  }

  const { user, newAccessToken, accessCookieOptions, newRefreshToken, refreshCookieOptions } =
    await refreshAccessTokenService(refreshToken);

  logger.info(`Access token and Refresh token refreshed successfully for ${user.email}`);

  res
    .status(200)
    .cookie("refreshToken", newRefreshToken, refreshCookieOptions)
    .cookie("accessToken", newAccessToken, accessCookieOptions)
    .json(
      new ApiResponse(200, "Access token refresh successfully", {
        user,
      })
    );
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = forgotPasswordSchema.parse(req.body);

  const user = await forgotPasswordService(email);

  return res.status(200).json(
    new ApiResponse(200, "Please reset your password with link sent on your email", {
      user,
    })
  );
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  const { token, newPassword, confirmNewPassword } = resetPasswordSchema.parse({
    ...req.body,
    token: req.params?.token,
  });

  const user = await resetPasswordService({
    token,
    newPassword,
    confirmNewPassword,
  });

  return res.status(200).json(
    new ApiResponse(200, "User password reset successfull", {
      user,
    })
  );
});

export const googleOAuthSuccessController = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Google authentication failed");
  }

  const { accessToken, refreshToken } = await loginWithGoogleService(user);

  const refreshCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };
  const accessCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 15,
  };

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.cookie("accessToken", accessToken, accessCookieOptions);

  return res.redirect(`${env.FRONTEND_URL}/profile`);
});
