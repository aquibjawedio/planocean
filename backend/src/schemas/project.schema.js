import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(3, "name must be of 3 characters"),
  description: z.string().trim().max(100, "description can be max of 100 characters"),
  createdBy: z.string().trim().min(1, "user id is required"),
});
