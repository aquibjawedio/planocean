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
import { clearCookieOptions, cookieOptions, verifyJWTRefreshToken } from "../utils/jwt.js";
import { logger } from "../utils/logger.js";
import { sendEmailVerificationLink } from "../utils/emailVerification.js";
import { Session } from "../models/session.model.js";

export const registerUserService = async (fullname, username, email, password) => {
  logger.info(`Checking if user already exists with email: ${email} or username: ${username}`);
  const userExists = await User.findOne({ $or: [{ email }, { username }] });

  if (userExists && userExists.email === email) {
    logger.error(`User already exists with email: ${email}`);
    throw new ApiError(409, "User already exists with this email");
  }

  if (userExists && userExists.username === username) {
    logger.error(`Username already exists: ${username}`);
    throw new ApiError(409, "User already exists with this username");
  }

  logger.info(`Attempting to create a new user with email: ${email}`);
  const user = await User.create({
    fullname,
    username,
    email,
    password,
  });

  if (!user) {
    logger.error("User creation failed");
    throw new ApiError(500, "User registration failed");
  }

  logger.info(`User created successfully with email: ${email}. Sending verification email...`);

  await sendEmailVerificationLink(user, email);

  logger.info(`User registration successful for email: ${email}`);

  return sanitizeUser(user);
};

export const loginUserService = async (email, password, device, ipAddress) => {
  const user = await User.findOne({ email });

  if (!user) {
    logger.warn(`Login failed : User not found with email ${email}`);
    throw new ApiError(404, "Invalid credentials!. Please enter valid credentials.");
  }

  if (!user.isEmailVerified) {
    logger.warn(`Login failed : User email is not verified - ${email}`);
    throw new ApiError(
      400,
      "Email is not verified. Verification link has been sent on your email."
    );
  }

  const isPasswordMatched = await user.isPasswordCorrect(password);
  if (!isPasswordMatched) {
    logger.warn(`Login failed : Password doesn't match - ${email}`);
    throw new ApiError(400, "Invalid credentials!. Please enter valid credentials.");
  }

  const accessToken = user.generateAccessToken();
  const accessCookieOptions = cookieOptions(1000 * 60 * 15);

  const refreshToken = user.generateRefreshToken();
  const refreshCookieOptions = cookieOptions(1000 * 60 * 60 * 24 * 7);

  const session = await Session.create({
    user: user._id,
    refreshToken,
    device,
    ipAddress,
    isValid: true,
  });

  user.session = session._id;
  await user.save();

  return {
    user: sanitizeUser(user),
    accessToken,
    accessCookieOptions,
    refreshToken,
    refreshCookieOptions,
  };
};

export const logoutUserService = async (refreshToken) => {
  if (!refreshToken) {
    logger.warn(`Logout failed : Refresh token is missing - ${refreshToken}`);
    throw new ApiError(401, "Refresh token is missing");
  }

  const session = await Session.findOne({
    refreshToken,
  });

  if (!session) {
    throw new ApiError(404, "Session not found for this user");
  }

  session.refreshToken = null;
  session.isValid = false;
  await session.save();

  logger.info(`Attemp to logout : Generating cookie options`);
  return clearCookieOptions();
};

export const verifyUserEmailService = async (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  logger.info(`Attempt to verify email : Finding user with token - ${token}`);
  const user = await User.findOne({ emailVerificationToken: hashedToken });

  if (!user) {
    logger.warn(`Email verification failed : User doesn't exists - ${token}`);
    throw new ApiError(404, "Invalid or expired token.");
  }

  if (!user.emailVerificationExpiry || new Date(user.emailVerificationExpiry) < new Date()) {
    logger.warn(
      `Verification failed : Email verification link expired , sending new link at - ${user.email}`
    );
    await sendEmailVerificationLink(user, user.email);
    throw new ApiError(
      401,
      "Email verification link expired, please verify with new email sent on your email."
    );
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save();

  return sanitizeUser(user);
};

export const resendVerificationURLService = async (email) => {
  logger.info(`Finding user with email ${email}`);
  const user = await User.findOne({ email });
  if (!user) {
    logger.warn(`Resend verification email failed : User not found - ${email}`);
    throw new ApiError(404, "User not found with this email");
  }

  if (user.isEmailVerified) {
    logger.warn(`Resend verification email failed : User is already verified - ${email}`);
    throw new ApiError(400, "User is already verified");
  }

  await sendEmailVerificationLink(user, user.email);
  logger.info(`Verification email sent successfully to : ${user.email}`);
  return sanitizeUser(user);
};

export const refreshAccessTokenService = async (refreshToken) => {
  logger.info(`Attempt to refresh token: Decoding data - ${refreshToken}`);
  const session = await Session.findOne({
    refreshToken,
  });

  if (!session) {
    logger.warn(`Refresh token failed : Session not found for token - ${refreshToken}`);
    throw new ApiError(404, "Session not found for this user");
  }

  if (!session.isValid) {
    logger.warn(`Refresh token failed : Session is not valid - ${refreshToken}`);
    throw new ApiError(401, "Unauthorized! Session is not valid");
  }

  const user = await User.findById(session.user.toString());

  if (!user) {
    logger.warn(`Refresh token failed : User not found for session - ${session._id}`);
    throw new ApiError(404, "User not found for this session");
  }

  logger.info(`User found : Now generating access and refresh token for - ${user.email}`);

  const newAccessToken = user.generateAccessToken();
  const accessCookieOptions = cookieOptions(1000 * 60 * 15);
  const newRefreshToken = user.generateRefreshToken();
  const refreshCookieOptions = cookieOptions(1000 * 60 * 60 * 24 * 7);

  session.refreshToken = newRefreshToken;
  session.isValid = true;
  await session.save();

  user.session = session._id;
  await user.save();

  logger.info(`Acess and Refresh token generated and saved in db - ${user.email}`);
  return {
    user: sanitizeUser(user),
    newAccessToken,
    accessCookieOptions,
    newRefreshToken,
    refreshCookieOptions,
  };
};

export const forgotPasswordService = async (email) => {
  logger.info(`Attemp to request forgot password - ${email}`);

  const user = await User.findOne({ email });

  if (!user) {
    logger.warn(`Forgot password failed : User not found - ${email}`);
    throw new ApiError(404, "User not found with this email");
  }

  logger.info(`User found : Generating tokens for forgot password ${email}`);
  const { unHashedToken, hashedToken, tokenExpiry } = await user.generateTemporaryToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;
  await user.save();

  const forgotPasswordUrl = `${env.FRONTEND_URL}/auth/forgot/${unHashedToken}`;

  sendEmail({
    email,
    subject: "Forgot Password",
    mailGenContent: forgotPasswordMailGenContent(user.fullname, forgotPasswordUrl),
  });

  logger.info(`Forgot password request successfull : Email sent to ${email} `);

  return sanitizeUser(user);
};

export const resetPasswordService = async ({ token, newPassword, confirmNewPassword }) => {
  if (newPassword !== confirmNewPassword) {
    logger.warn("Reset password failed : New password and confirm password do not match");
    throw new ApiError(400, "New password and confirm new password must be same");
  }

  logger.info(`Attempt to reset password with token - ${token}`);
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({ forgotPasswordToken: hashedToken });
  if (!user) {
    logger.warn(`Reset password failed : User not found with token - ${token}`);
    throw new ApiError(404, "Invalid token! user not found");
  }

  if (!user.forgotPasswordExpiry || new Date(user.forgotPasswordExpiry) < new Date()) {
    logger.warn(`Reset password failed : Token expired for user - ${user.email}`);
    throw new ApiError(400, "Token Expired! Please requrest for new reset url");
  }

  user.password = newPassword;
  user.forgotPasswordToken = null;
  user.forgotPasswordExpiry = null;
  await user.save();

  logger.info(`Password reset successful for user - ${user.email}`);

  return sanitizeUser(user);
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
      avatarUrl: profile.photos?.[0]?.value || "https://placehold.co/400",
    });
  }
  return user;
};

export const loginWithGoogleService = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return { accessToken, refreshToken };
};
