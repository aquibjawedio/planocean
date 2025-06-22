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

  const user = await User.create({ fullname, username, email, password });
  return sanitizeUser(user);
};

export const loginUserService = async (username, email, password) => {};
