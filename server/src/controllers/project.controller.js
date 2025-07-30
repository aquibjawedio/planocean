import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  addProjectMemberSchema,
  createProjectSchema,
  deleteProjectSchema,
  getAllProjectMembersSchema,
  getAllProjectsSchema,
  getProjectByIdSchema,
  removeProjectMemberSchema,
  updateMemberRoleSchema,
  updateProjectSchema,
} from "../schemas/project.schema.js";
import {
  addProjectMemberService,
  createProjectService,
  deleteProjectService,
  getAllProjectMembersService,
  getAllProjectsService,
  getProjectByIdService,
  removeProjectMemberService,
  updateMemberRoleService,
  updateProjectService,
} from "../services/project.service.js";

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

export const getAllProjectsController = asyncHandler(async (req, res) => {
  const { userId } = getAllProjectsSchema.parse({ userId: req.user._id.toString() });

  const projects = await getAllProjectsService(userId);

  return res.status(200).json(
    new ApiResponse(200, "Fetched all project associated with user successfully", {
      projects,
    })
  );
});

export const getProjectByIdController = asyncHandler(async (req, res) => {
  const { projectId } = getProjectByIdSchema.parse({ projectId: req.params?.projectId });

  const project = await getProjectByIdService(projectId);

  return res.status(200).json(new ApiResponse(200, "Project fetched successfully  ", { project }));
});

export const updateProjectController = asyncHandler(async (req, res) => {
  const id = req.params?.projectId;

  const { projectId, name, description } = updateProjectSchema.parse({
    projectId: id,
    ...req.body,
  });

  const updatedProject = await updateProjectService({
    projectId,
    name,
    description,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Project updated successfully", { updatedProject }));
});

export const addProjectMemberController = asyncHandler(async (req, res) => {
  const { email, projectId, role } = addProjectMemberSchema.parse({
    ...req.body,
    projectId: req.params.projectId,
  });

  const { member } = await addProjectMemberService({ email, projectId, role });

  return res.status(201).json(new ApiResponse(201, "Member added successfully", { member }));
});

export const removeProjectMemberController = asyncHandler(async (req, res) => {
  const { projectId, email } = removeProjectMemberSchema.parse({
    ...req.body,
    projectId: req.params.projectId,
  });

  const member = await removeProjectMemberService({ projectId, email });

  return res.status(200).json(new ApiResponse(200, "Member removed successfully", { member }));
});

export const getAllProjectMembersController = asyncHandler(async (req, res) => {
  const { projectId } = getAllProjectMembersSchema.parse({
    projectId: req.params.projectId,
  });

  const members = await getAllProjectMembersService(projectId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Fetched all project members successfully", { members }));
});

export const updateMemberRoleController = asyncHandler(async (req, res) => {
  const { memberId, role } = updateMemberRoleSchema.parse({
    ...req.body,
    memberId: req.params.memberId,
  });

  const member = await updateMemberRoleService({ memberId, role });

  return res.status(201).json(new ApiResponse(201, "Member role update successfully", { member }));
});

export const deleteProjectController = asyncHandler(async (req, res) => {
  const { projectId, userId } = deleteProjectSchema.parse({
    projectId: req.params.projectId,
    userId: req.user._id.toString(),
  });

  const project = await deleteProjectService(projectId);

  return res.status(200).json(new ApiResponse(200, "Project deleted successfully", { project }));
});
