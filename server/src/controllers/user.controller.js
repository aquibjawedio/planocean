import {
  getCurrentUserSchema,
  updateUserAvatarSchema,
  updateUserEmailSchema,
  updateUserPasswordSchema,
  updateUserProfileSchema,
} from "../schemas/user.schema.js";
import {
  getCurrentUserService,
  updateUserAvatarService,
  updateUserEmailService,
  updateUserPasswordService,
  updateUserProfileService,
} from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const getCurrentUserController = asyncHandler(async (req, res) => {
  const { userId } = getCurrentUserSchema.parse({ userId: req.user._id });

  const user = await getCurrentUserService(userId);
  return res
    .status(200)
    .json(new ApiResponse(200, "Current user data fetched successfully", { user }));
});

export const updatedUserAvatarController = asyncHandler(async (req, res) => {
  const url = await uploadOnCloudinary(req.file.path);
  const { userId } = updateUserAvatarSchema.parse({
    userId: req.user._id,
  });
  const user = await updateUserAvatarService({
    userId,
    avatarUrl: url,
  });
  return res.status(200).json(new ApiResponse(200, "User avatar updated successfully", { user }));
});

export const updateUserProfileController = asyncHandler(async (req, res) => {
  const { fullname, username, bio, location, userId, socialLinks } = updateUserProfileSchema.parse({
    ...req.body,
    userId: req.user._id,
  });

  const user = await updateUserProfileService({
    fullname,
    username,
    bio,
    location,
    socialLinks,
    userId,
  });

  return res.status(201).json(new ApiResponse(201, "User profile updated successfully", { user }));
});

export const updateUserEmailController = asyncHandler(async (req, res) => {
  const { email, userId, password } = updateUserEmailSchema.parse({
    ...req.body,
    userId: req.user._id,
  });

  const user = await updateUserEmailService(email, userId, password);

  return res.status(201).json(new ApiResponse(201, "User email updated successfully", { user }));
});

export const updateUserPasswordController = asyncHandler(async (req, res) => {
  const { userId, currentPassword, newPassword, confirmNewPassword } =
    updateUserPasswordSchema.parse({ ...req.body, userId: req.user._id });

  const user = await updateUserPasswordService(
    userId,
    currentPassword,
    newPassword,
    confirmNewPassword
  );

  return res.status(201).json(new ApiResponse(201, "User password updated successfully", { user }));
});
