import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})

export const registerSchema = z.object({
    fullname: z.string().trim().min(1, "Full name is required"),
    username: z.string().trim().min(5, "Username must be at least 5 characters long"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})