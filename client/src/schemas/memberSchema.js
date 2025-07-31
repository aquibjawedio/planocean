import { z } from "zod";

export const addMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  projectId: z.string().nonempty("Project ID is required"),
  role: z.enum(["project_admin", "member"]).default("member"),
});

export const editMemberRoleSchema = z.object({
  projectId: z.string().nonempty("Project ID is required"),
  role: z.enum(["project_admin", "member"]).default("member"),
});
