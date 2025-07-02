import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

export const updateUsernameService = async (username, userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found! Please login first");
  }

  user.username = username;
  await user.save();

  return { user: sanitizeUser(user), updateStatus: true };
};
