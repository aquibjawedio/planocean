import { emailVerificationMailGenContent, sendEmail } from "../utils/sendEmail.js";
import { logger } from "../utils/logger.js";
import { ApiError } from "./ApiError.js";
import { env } from "../config/env.js";

const sendEmailVerificationLink = async (user, email) => {
  const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();
  console.log(`Generated token for user ${user._id}: ${unHashedToken}`);
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save();

  logger.info(`Email verification token saved for user ID ${user._id}`);

  const verificationUrl = `${env.FRONTEND_URL}/auth/verify-email/${unHashedToken}`;

  logger.info(`Sending verification link: ${verificationUrl} to: ${email}`);
  try {
    await sendEmail({
      email,
      subject: "Email Verification",
      mailGenContent: emailVerificationMailGenContent(user.fullname, verificationUrl),
    });
  } catch (error) {
    logger.error(`Failed to send verification email: ${error.message}`);
    throw new ApiError(500, "Failed to send verification email");
  }
  logger.info(`Verification email sent to: ${email}`);
};

export { sendEmailVerificationLink };
