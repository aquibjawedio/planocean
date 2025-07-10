import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  addMemberSchema,
  createProjectSchema,
  getProjectByIdSchema,
  updateMemberRoleSchema,
  updateProjectSchema,
} from "../schemas/project.schema.js";
import {
  addMemberService,
  createProjectService,
  updateMemberRoleService,
  updateProjectService,
} from "../services/project.service.js";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ProjectMember } from "../models/projectmember.model.js";

export const createProjectController = asyncHandler(async (req, res) => {
  const userId = req.user?._id.toString();
  const { name, description, createdBy } = createProjectSchema.parse({
    ...req.body,
    createdBy: userId,
  });

  const { project, projectMember } = await createProjectService({ name, description, createdBy });
  return res.status(201).json(
    new ApiResponse(201, "Project created successfully", {
      project,
      projectMember,
    })
  );
});

export const getAllProjectController = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  const memberships = await ProjectMember.find({ user: userId });
  const memberProjectIds = memberships.map((m) => m.project.toString());

  const projects = await Project.find({
    $or: [{ createdBy: userId }, { _id: { $in: memberProjectIds } }],
  });

  return res.status(200).json(
    new ApiResponse(200, "Fetched all project associated with user successfully", {
      projects,
      memberships,
    })
  );
});

export const getProjectsCreatedByUserController = asyncHandler(async (req, res) => {
  const projects = await Project.find({ createdBy: req.user._id.toString() });

  if (!projects) {
    throw new ApiError(404, "No projects found created by user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Fetched all projects created by user", { projects }));
});

export const getProjectByIdController = asyncHandler(async (req, res) => {
  const { projectId } = getProjectByIdSchema.parse({ projectId: req.params?.projectId });
  const project = await Project.findOne({ _id: projectId });

  if (!project) {
    throw new ApiError(404, "Porject not found with this project id");
  }
  return res.status(200).json(new ApiResponse(200, "Project found with id", { project }));
});

export const updateProjectController = asyncHandler(async (req, res) => {
  const userId = req.user?._id.toString();
  const id = req.params?.projectId;

  const { projectId, name, description, createdBy } = updateProjectSchema.parse({
    projectId: id,
    ...req.body,
    createdBy: userId,
  });

  const { updatedProject } = await updateProjectService({
    projectId,
    name,
    description,
    createdBy,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Project updated successfully", { updatedProject }));
});

export const addMemberController = asyncHandler(async (req, res) => {
  const { username, projectId, role } = addMemberSchema.parse({
    ...req.body,
    projectId: req.params.projectId,
  });

  const { member } = await addMemberService({ username, projectId, role });

  return res.status(201).json(new ApiResponse(201, "Member added successfully", { member }));
});

export const updateMemberRoleController = asyncHandler(async (req, res) => {
  const { username, projectId, role } = updateMemberRoleSchema.parse({
    ...req.body,
    projectId: req.params.projectId,
  });

  const { member } = await updateMemberRoleService({ username, projectId, role });

  return res.status(201).json(new ApiResponse(201, "Member role update successfully", { member }));
});

export const deleteProjectController = asyncHandler(async (req, res) => {});
