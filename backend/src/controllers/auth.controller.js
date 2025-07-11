import {
  forgotPasswordSchema,
  loginUserSchema,
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
  refreshAccessTokenService,
  registerUserService,
  resendVerificationURLService,
  resetPasswordService,
  verifyUserEmailService,
} from "../services/auth.service.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { env } from "../config/env.js";
import { clearCookieOptions } from "../utils/jwt.js";

export const registerUserController = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = registerUserSchema.parse(req.body);

  const user = await registerUserService(fullname, username, email, password);

  return res.status(201).json(new ApiResponse(201, "User registered successfully", user));
});

export const loginUserController = asyncHandler(async (req, res) => {
  if (req.cookies?.refreshToken) {
    console.log(req.cookies?.refreshToken);
    throw new ApiError(400, "User is already loggedin");
  }
  const { email, password } = loginUserSchema.parse(req.body);

  const { user, accessToken, accessCookieOptions, refreshToken, refreshCookieOptions } =
    await loginUserService(email, password);

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, refreshCookieOptions)
    .cookie("accessToken", accessToken, accessCookieOptions)
    .json(new ApiResponse(200, "User loggedin successfully", { user: sanitizeUser(user) }));
});

export const logoutUserController = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new ApiError(400, "User is already logged out");
  }

  const options = clearCookieOptions();

  res.clearCookie("refreshToken", options);
  res.clearCookie("accessToken", options);

  res.status(200).json(new ApiResponse(200, "User logged out successfully"));
});

export const verifyUserEmailController = asyncHandler(async (req, res) => {
  const { token } = verifyUserEmailSchema.parse({ token: req.params?.token });

  if (!token) {
    throw new ApiError(404, "Token not found");
  }
  const { user, verified } = await verifyUserEmailService(token);
  res
    .status(200)
    .json(new ApiResponse(200, "User email verification successfull", { user, verified }));
});

export const resendVerificationURLController = asyncHandler(async (req, res) => {
  const { email } = resendVerificationURLSchema.parse(req.body);

  const user = await resendVerificationURLService(email);

  return res.status(200).json(
    new ApiResponse(200, "Email resend successfully. Please check spam folder", {
      user,
    })
  );
});

export const refreshAccessTokenController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "Unauthorized! Refresh token is missing");
  }

  const { user, newAccessToken, newRefreshToken } = await refreshAccessTokenService(refreshToken);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    samesite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 15,
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.status(200).json(
    new ApiResponse(200, "Access token refresh successfully", {
      accessToken: newAccessToken,
    })
  );
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = forgotPasswordSchema.parse(req.body);

  const { user, urlWillExpire } = await forgotPasswordService(email);

  return res.status(200).json(
    new ApiResponse(200, "Link sent on your email to reset your new password", {
      user,
      urlWillExpire,
    })
  );
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  const { token, newPassword, confirmNewPassword } = resetPasswordSchema.parse({
    ...req.body,
    token: req.params?.token,
  });

  const { user, resetStatus } = await resetPasswordService({
    token,
    newPassword,
    confirmNewPassword,
  });

  return res.status(200).json(
    new ApiResponse(200, "User password reset successfull", {
      user,
      resetStatus,
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

  return res.status(200).json(
    new ApiResponse(200, "Google login successful", {
      user: sanitizeUser(user),
      accessToken,
    })
  );
});
