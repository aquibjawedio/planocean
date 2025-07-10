import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ProjectMember } from "../models/projectmember.model.js";
import { UserRolesEnum } from "../constants/user.constant.js";

export const createProjectService = async ({ name, description, createdBy }) => {
  const existingProject = await Project.findOne({ name });
  if (existingProject) {
    throw new ApiError(409, "Project already exists with this name, please choose other name");
  }
  const project = await Project.create({
    name,
    description,
    createdBy,
  });

  if (!project) {
    throw new ApiError(500, "Unable to create project");
  }

  const projectMember = await ProjectMember.create({
    project: project._id,
    role: UserRolesEnum.PROJECT_ADMIN,
    user: createdBy,
  });

  if (!projectMember) {
    throw new ApiError(500, "Unable to create projectMember");
  }

  return { project, projectMember };
};

export const updateProjectService = async ({ projectId, name, description, createdBy }) => {
  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { name, description },
    { new: true, runValidators: true }
  );

  if (!updatedProject) {
    throw new ApiError(404, "Unauthorized or project not found");
  }

  return { updatedProject };
};

export const addMemberService = async ({ username, projectId, role }) => {
  const existingUser = await User.findOne({ username });
  if (!existingUser) {
    throw new ApiError(404, "User not found! Invalid username");
  }

  const existingMember = await ProjectMember.findOne({
    project: projectId,
    user: existingUser._id.toString(),
  });

  if (existingMember) {
    throw new ApiError(409, "Member already exists in this project");
  }

  const member = await ProjectMember.create({
    role,
    project: projectId,
    user: existingUser._id.toString(),
  });

  if (!member) {
    throw new ApiError(500, "Unable to add member in the project");
  }
  return { member };
};

export const updateMemberRoleService = async ({ username, projectId, role }) => {
  const existingUser = await User.findOne({ username });

  if (!existingUser) {
    throw new ApiError(404, "User not found! Invalid username");
  }

  const member = await ProjectMember.findOne({
    project: projectId,
    user: existingUser._id.toString(),
  });

  if (!member) {
    throw new ApiError(409, "User doesn't exists in this project");
  }

  if (member.role === role) {
    throw new ApiError(400, "No change in role of user");
  }

  member.role = role;
  await member.save();

  return { member };
};
