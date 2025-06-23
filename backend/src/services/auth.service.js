import crypto from "crypto";

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { sendEmail, emailVerificationMailGenContent } from "../utils/sendEmail.js";

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
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invalid credentials!");
  }

  const isPasswordMatched = await user.isPasswordCorrect(password);
  if (!isPasswordMatched) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid credentials!");
  }

  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};
