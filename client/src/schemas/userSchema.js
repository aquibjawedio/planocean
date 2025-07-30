import { z } from "zod";

export const personalSchema = z.object({
  fullname: z.string().min(2),
  username: z.string().min(2),
  bio: z.string().optional(),
  website: z.string().url().optional(),
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});
