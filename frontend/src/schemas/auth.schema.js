import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string().trim().min(8, "Password must be at least 8 characters long"),
});

export const registerSchema = z.object({
  fullname: z.string().trim().min(1, "Full name is required"),
  username: z.string().trim().min(1, "Username is required"),
  email: z.string().trim().email("Invalid email format"),
  password: z.string().trim().min(8, "Password must be at least 8 characters long"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, "Token is required"),
    password: z.string().trim().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .trim()
      .min(8, "Confirm password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });
