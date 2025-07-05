import { z } from "zod";
import { AvailableUserRoles } from "../constants/user.constant.js";

export const createProjectSchema = z.object({
  name: z.string().trim().min(3, "name must be of 3 characters"),
  description: z.string().trim().max(100, "description can be max of 100 characters"),
  createdBy: z.string().trim().min(1, "user id is required"),
});

export const getProjectByIdSchema = z.object({
  projectId: z.string().trim().min(1, "Invalid project id"),
});

export const updateProjectSchema = z.object({
  projectId: z.string().trim().min(1, "project id is required"),
  name: z.string().trim().min(3, "name must be of 3 characters"),
  description: z.string().trim().max(100, "description can be max of 100 characters"),
  createdBy: z.string().trim().min(1, "user id is required"),
});

export const addMemberSchema = z.object({
  username: z.string().trim().min(3, "Invalid username, atleast 3 characters required"),
  projectId: z.string().trim().min(1, "Project id is required"),
  role: z
    .enum(AvailableUserRoles, {
      required_error: "Status is required",
      invalid_type_error: "Status must be one of MEMBER or PROJECT_ADMIN",
    })
    .default("MEMBER"),
});

export const updateMemberRoleSchema = z.object({
  username: z.string().trim().min(3, "Invalid username, atleast 3 characters required"),
  projectId: z.string().trim().min(1, "Project id is required"),
  role: z
    .enum(AvailableUserRoles, {
      required_error: "Status is required",
      invalid_type_error: "Status must be one of MEMBER or PROJECT_ADMIN",
    })
    .default("MEMBER"),
});
