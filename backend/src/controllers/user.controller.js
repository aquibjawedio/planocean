import { updateUsernameSchema } from "../schemas/user.schema.js";
import { updateUsernameService } from "../services/user.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCurrentUserController = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(400, "User not found! please login first");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Current user data fetched successfully", { user }));
});

export const updateUsernameController = asyncHandler(async (req, res) => {
  const { username } = updateUsernameSchema.parse(req.body);

  if (username === req.user.username) {
    throw new ApiError(
      409,
      "Updated username is same as current username. Please select different username to update"
    );
  }
  const { user, updateStatus } = await updateUsernameService(username, req.user._id);
  return res
    .status(201)
    .json(new ApiResponse(201, "username updated successfully", { user, updateStatus }));
});
