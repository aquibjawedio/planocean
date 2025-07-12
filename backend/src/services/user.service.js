import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

export const getCurrentUserService = async (userId) => {
  logger.info(`Attempt to get user : Finding user with id - ${userId}`);
  const user = await User.findById(userId);

  if (!user) {
    logger.warn(`Failed to get user : User doesn't exists with id - ${userId}`);
    throw new ApiError(401, "User not found, Invalid user id");
  }

  logger.info(`User fetched successfully: User email - ${user.email}`);

  return sanitizeUser(user);
};

export const updateUserProfileService = async ({
  fullname,
  username,
  avatarUrl,
  bio,
  location,
  socialLinks,
  userId,
}) => {
  logger.info(`Attempt to update user profile: User id - ${userId}`);

  const user = await User.findById(userId);

  if (!user) {
    logger.warn(`Failed to update user profile: User doesn't exists with id - ${userId}`);
    throw new ApiError(404, "User not found, Invalid user id");
  }

  user.fullname = fullname;
  user.username = username;
  user.avatarUrl = avatarUrl;
  user.bio = bio;
  user.location = location;
  user.socialLinks = socialLinks;
  const updateUser = await user.save();

  if (!updateUser) {
    logger.warn(`Failed to update user profile: User doesn't exists with id - ${userId}`);
    throw new ApiError(404, "User not found, Invalid user id");
  }

  logger.info(`User profile updated successfully: User id - ${userId}`);
  return sanitizeUser(updateUser);
};

export const updateUserEmailService = async (email, userId, password) => {
  logger.info(`Attempt to update user email: User id - ${userId}`);
  const user = await User.findById(userId);

  if (!user) {
    logger.warn(`Failed to update user email: User doesn't exists with id - ${userId}`);
    throw new ApiError(401, "User not found, invalid user id.");
  }

  if (user.email === email) {
    logger.warn(`Failed to update user email: New email is same as current email - ${email}`);
    throw new ApiError(400, "New email cannot be the same as the current email.");
  }

  if (!user.password) {
    logger.warn(`Failed to update user email: User with id - ${userId} has no password set.`);
    throw new ApiError(400, "User has no password set. Cannot update email.");
  }

  const isPasswordMatched = await user.isPasswordCorrect(password);

  if (!isPasswordMatched) {
    logger.warn(`Failed to update user email: Incorrect password provided for user id - ${userId}`);
    throw new ApiError(401, "Incorrect password provided.");
  }

  user.email = email;
  const updatedUser = await user.save();

  logger.info(`User email updated successfully: User id - ${userId}, New email - ${email}`);
  return sanitizeUser(updatedUser);
};

export const updateUserPasswordService = async (
  userId,
  currentPassword,
  newPassword,
  confirmNewPassword
) => {
  logger.info(`Attempt to update user password: User id - ${userId}`);

  if (newPassword !== confirmNewPassword) {
    logger.warn(
      `Failed to update user password: New password and confirm password do not match for user id - ${userId}`
    );
    throw new ApiError(400, "New password and confirm password must match.");
  }

  const user = await User.findById(userId);

  if (!user) {
    logger.warn(`Failed to update user password: User doesn't exists with id - ${userId}`);
    throw new ApiError(404, "User not found, Invalid user id");
  }

  const isPasswordMatched = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordMatched) {
    logger.warn(
      `Failed to update user password: Incorrect current password for user id - ${userId}`
    );
    throw new ApiError(401, "Incorrect current password provided.");
  }

  user.password = newPassword;
  const updatedUser = await user.save();

  if (!updatedUser) {
    logger.warn(`Failed to update user password: User doesn't exists with id - ${userId}`);
    throw new ApiError(404, "User not found, Invalid user id");
  }

  logger.info(`User password updated successfully: User id - ${userId}`);
  return sanitizeUser(updatedUser);
};
