import crypto from "crypto";
import jwt from "jsonwebtoken";

// Imports from folders
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

import { sanitizeUser } from "../utils/sanitizeUser.js";
import {
  sendEmail,
  emailVerificationMailGenContent,
  forgotPasswordMailGenContent,
} from "../utils/sendEmail.js";
import { env } from "../config/env.js";
import { cookieOptions } from "../utils/jwt.js";

export const registerUserService = async (fullname, username, email, password) => {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(409, "User already exists with this email");
  }

  const existingUsername = await User.findOne({ username });

  if (existingUsername) {
    throw new ApiError(409, "User already exists with this username");
  }

  const user = await User.create({
    fullname,
    username,
    email,
    password,
  });

  const { unHashedToken, hashedToken } = user.generateTemporaryToken();
  user.emailVerificationToken = hashedToken;
  await user.save();

  const verificationUrl = `${env.FRONTEND_URL}/api/v1/auth/verify-email/${unHashedToken}`;

  await sendEmail({
    email,
    subject: "Email Verification",
    mailGenContent: emailVerificationMailGenContent(fullname, verificationUrl),
  });

  return sanitizeUser(user);
};

export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user.isEmailVerified) {
    throw new ApiError(
      400,
      "Email is not verified. Verification link has been sent on your email."
    );
  }
  if (!user) {
    throw new ApiError(404, "Invalid credentials!. Please enter valid credentials.");
  }

  const isPasswordMatched = await user.isPasswordCorrect(password);
  if (!isPasswordMatched) {
    throw new ApiError(400, "Invalid credentials!. Please enter valid credentials.");
  }

  const accessToken = user.generateAccessToken();
  const accessCookieOptions = cookieOptions(1000 * 60 * 15);

  const refreshToken = user.generateRefreshToken();
  const refreshCookieOptions = cookieOptions(1000 * 60 * 60 * 24 * 7);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, accessCookieOptions, refreshToken, refreshCookieOptions };
};

export const verifyUserEmailService = async (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({ emailVerificationToken: hashedToken });

  if (!user) {
    throw new ApiError(404, "Invalid or expired token.");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  return { user: sanitizeUser(user), verified: user.isEmailVerified };
};

export const resendVerificationURLService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "user not found with this email");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "user is already verified");
  }

  const { unHashedToken, hashedToken, tokenExpiry } = await user.generateTemporaryToken();

  const verificationUrl = `${env.FRONTEND_URL}/api/v1/auth/verify-email/${unHashedToken}`;

  user.emailVerificationToken = hashedToken;
  await user.save();

  await sendEmail({
    email,
    subject: "Email Verification",
    mailGenContent: emailVerificationMailGenContent(user.fullname, verificationUrl),
  });

  return sanitizeUser(user);
};

export const refreshAccessTokenService = async (refreshToken) => {
  let decodedData;
  try {
    decodedData = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid or expired refresh token");
  }

  const user = await User.findById(decodedData._id);
  if (!user) {
    throw new ApiError(404, "User not found! Invalid refresh token");
  }

  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save();

  return { user, newAccessToken, newRefreshToken };
};

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found with this email");
  }
  const { unHashedToken, hashedToken, tokenExpiry } = await user.generateTemporaryToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;
  await user.save();

  const forgotPasswordUrl = `${env.FRONTEND_URL}/api/v1/auth/reset-password/${unHashedToken}`;

  sendEmail({
    email,
    subject: "Forgot Password",
    mailGenContent: forgotPasswordMailGenContent(user.fullname, forgotPasswordUrl),
  });

  return {
    user: sanitizeUser(user),
    urlWillExpire: user.forgotPasswordExpiry,
  };
};

export const resetPasswordService = async ({ token, newPassword, confirmNewPassword }) => {
  if (newPassword !== confirmNewPassword) {
    throw new ApiError(400, "New password and confirm new password must be same");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  console.log("token : ", hashedToken);

  const user = await User.findOne({ forgotPasswordToken: hashedToken });
  console.log("user : ", user);
  if (!user) {
    throw new ApiError(404, "Invalid token! user not found");
  }

  if (Date.now() > user.forgotPasswordExpiry) {
    throw new ApiError(400, "Token Expired! Please requrest for new reset url");
  }

  user.password = newPassword;
  user.forgotPasswordToken = null;
  user.forgotPasswordExpiry = Date.now();
  await user.save();

  return { user, resetStatus: true };
};

export const handleGoogleOAuthUserService = async (profile) => {
  const email = profile.emails[0].value;

  let user = await User.findOne({ email });

  if (!user) {
    let username = email.split("@")[0].toLowerCase();
    let count = 1;

    while (await User.exists({ username })) {
      username = `${username}${count++}`;
    }

    user = await User.create({
      fullname: profile.displayName,
      username,
      email,
      isEmailVerified: true,
      avatarUrl: {
        url: profile.photos?.[0]?.value || "https://placehold.co/400",
        localpath: "",
      },
    });
  }
  return user;
};

export const loginWithGoogleService = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return { accessToken, refreshToken };
};
