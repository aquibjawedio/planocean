import crypto from "crypto";
import jwt from "jsonwebtoken";

// Imports from folders
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import {
  sendEmail,
  emailVerificationMailGenContent,
  forgotPasswordMailGenContent,
} from "../utils/sendEmail.js";

export const registerUserService = async (fullname, username, email, password) => {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "User already exists with this email");
  }
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "User already exists with this username");
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationUrl = `${process.env.BACKEND_URL}/api/v1/auth/verify-email/${verificationToken}`;

  await sendEmail({
    email,
    subject: "Email Verification",
    mailGenContent: emailVerificationMailGenContent(fullname, verificationUrl),
  });

  const user = await User.create({
    fullname,
    username,
    email,
    password,
    emailVerificationToken: verificationToken,
  });
  return sanitizeUser(user);
};

export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user.isEmailVerified) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Email is not verified. Verification link has been sent on your email."
    );
  }
  if (!user) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Invalid credentials!. Please enter valid credentials."
    );
  }

  const isPasswordMatched = await user.isPasswordCorrect(password);
  if (!isPasswordMatched) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Invalid credentials!. Please enter valid credentials."
    );
  }

  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const verifyUserEmailService = async (token) => {
  const user = await User.findOne({ emailVerificationToken: token });

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invalid or expired token.");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  return { user: sanitizeUser(user), verified: user.isEmailVerified };
};

export const resendVerificationURLService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "user not found with this email");
  }

  if (user.isEmailVerified) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "user is already verified");
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationUrl = `${process.env.BACKEND_URL}/api/v1/auth/verify-email/${verificationToken}`;

  await sendEmail({
    email,
    subject: "Email Verification",
    mailGenContent: emailVerificationMailGenContent(user.fullname, verificationUrl),
  });

  user.emailVerificationToken = verificationToken;
  await user.save();

  return sanitizeUser(user);
};

export const refreshAccessTokenService = async (refreshToken) => {
  let decodedData;
  try {
    decodedData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      error.message || "Invalid or expired refresh token"
    );
  }

  const user = await User.findById(decodedData._id);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found! Invalid refresh token");
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
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found with this email");
  }

  const passwordToken = crypto.randomBytes(23).toString("hex");

  const forgotPasswordUrl = `${process.env.BACKEND_URL}/api/v1/auth/change-password/${passwordToken}`;

  sendEmail({
    email,
    subject: "Forgot Password",
    mailGenContent: forgotPasswordMailGenContent(user.fullname, forgotPasswordUrl),
  });

  user.forgotPasswordToken = passwordToken;
  user.forgotPasswordExpiry = new Date(Date.now() + 1000 * 60 * 10);
  await user.save();

  return { user: sanitizeUser(user), urlWillExpire: user.forgotPasswordExpiry };
};
