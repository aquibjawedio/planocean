import { z } from "zod";
import { AvailableUserRoles } from "../constants/user.constant.js";

export const createProjectSchema = z.object({
  name: z.string().trim().min(3, "name must be of 3 characters"),
  description: z.string().trim().max(100, "description can be max of 100 characters"),
  createdBy: z.string().trim().min(1, "user id is required"),
});

export const getAllProjectsSchema = z.object({
  userId: z.string().trim().min(1, "User id is required"),
});

export const getProjectByIdSchema = z.object({
  projectId: z.string().trim().min(1, "Invalid project id"),
});

export const updateProjectSchema = z.object({
  projectId: z.string().trim().min(1, "project id is required"),
  name: z.string().trim().min(3, "name must be of 3 characters"),
  description: z.string().trim().max(100, "description can be max of 100 characters"),
});

export const addProjectMemberSchema = z.object({
  email: z.string().email("Invalid email format"),
  projectId: z.string().trim().min(1, "Project id is required"),
  role: z
    .enum(AvailableUserRoles, {
      required_error: "Status is required",
      invalid_type_error: "Status must be one of MEMBER or PROJECT_ADMIN",
    })
    .default("MEMBER"),
});

export const removeProjectMemberSchema = z.object({
  projectId: z.string().trim().min(1, "Project id is required"),
  memberId: z.string().trim().min(1, "Member id is required"),
});

export const getAllProjectMembersSchema = z.object({
  projectId: z.string().trim().min(1, "Project id is required"),
});

export const updateMemberRoleSchema = z.object({
  role: z
    .enum(AvailableUserRoles, {
      required_error: "Status is required",
      invalid_type_error: "Status must be one of MEMBER or PROJECT_ADMIN",
    })
    .default("MEMBER"),
  memberId: z.string().trim().min(1, "Member id is required"),
  projectId: z.string().trim().min(1, "Project id is required"),
  userId: z.string().trim().min(1, "User id is required"),
});

export const deleteProjectSchema = z.object({
  projectId: z.string().trim().min(1, "Project id is required"),
  userId: z.string().trim().min(1, "User id is required"),
});
