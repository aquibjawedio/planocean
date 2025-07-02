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

  const unHashedToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");

  const verificationUrl = `${process.env.FRONTEND_URL}/api/v1/auth/verify-email/${unHashedToken}`;

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
    emailVerificationToken: hashedToken,
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
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({ emailVerificationToken: hashedToken });

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

  const { unHashedToken, hashedToken, tokenExpiry } = await user.generateTemporaryToken();

  const verificationUrl = `${process.env.FRONTEND_URL}/api/v1/auth/verify-email/${unHashedToken}`;

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
  const { unHashedToken, hashedToken, tokenExpiry } = await user.generateTemporaryToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;
  await user.save();

  const forgotPasswordUrl = `${process.env.FRONTEND_URL}/api/v1/auth/reset-password/${unHashedToken}`;

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
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "New password and confirm new password must be same"
    );
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  console.log("token : ", hashedToken);

  const user = await User.findOne({ forgotPasswordToken: hashedToken });
  console.log("user : ", user);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invalid token! user not found");
  }

  if (Date.now() > user.forgotPasswordExpiry) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Token Expired! Please requrest for new reset url");
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
