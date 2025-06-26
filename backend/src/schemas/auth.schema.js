import { z } from "zod";

export const registerUserSchema = z.object({
  fullname: z.string().min(3, { message: "Full name must be at least 3 characters long." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 6 characters long." }),
});

export const loginUserSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 6 characters long." }),
});

export const verifyUserEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const resendVerificationURLSchema = z.object({
  email: z.string().email("valid email is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("valid email is required"),
});
