import { z } from "zod";

export const getCurrentUserSchema = z.object({
  userId: z.string().trim().min(1, "User id is required"),
});

export const updateUserAvatarSchema = z.object({
  userId: z.string().trim().min(1, "User id is required"),
});

export const updateUserProfileSchema = z.object({
  fullname: z.string().trim().min(1, "Full name is required"),
  username: z.string().trim().min(1, "Username is required"),
  bio: z.string().trim().optional(),
  location: z.string().trim().optional(),
  socialLinks: z
    .object({
      twitter: z.string().trim().optional(),
      linkedin: z.string().trim().optional(),
      github: z.string().trim().optional(),
      instagram: z.string().trim().optional(),
      website: z.string().trim().optional(),
    })
    .optional(),
  userId: z.string().trim().min(1, "User id is required"),
});

export const updateUserEmailSchema = z.object({
  email: z.string().email("Invalid email format").trim().min(1, "Email is required"),
  userId: z.string().trim().min(1, "User id is required"),
  password: z.string().trim().min(1, "Password is required"),
});

export const updateUserPasswordSchema = z
  .object({
    currentPassword: z.string().trim().min(1, "Current password is required"),
    newPassword: z.string().trim().min(1, "New password is required"),
    confirmNewPassword: z.string().trim().min(1, "Confirm new password is required"),
    userId: z.string().trim().min(1, "User id is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New password and confirm new password must match",
  });
