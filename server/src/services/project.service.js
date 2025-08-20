import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ProjectMember } from "../models/projectmember.model.js";
import { UserRolesEnum } from "../constants/user.constant.js";
import { logger } from "../utils/logger.js";
import { Notification } from "../models/notification.model.js";
import { NotificationTypesEnum } from "../constants/notification.constant.js";

export const createProjectService = async ({ name, description, createdBy }) => {
  logger.info(
    `Attempt to create project : Checking if project exists with same name for user - ${createdBy}`
  );
  const projectExists = await Project.findOne({ name, createdBy });
  if (projectExists) {
    logger.error("Project already exists with this name for user");
    throw new ApiError(409, "Project already exists with this name, please choose other name");
  }

  logger.info("Creating new project");
  const project = await Project.create({
    name,
    description,
    createdBy,
  });
  logger.info("Project created successfully");

  if (!project) {
    logger.error("Unable to create project");
    throw new ApiError(500, "Unable to create project");
  }

  logger.info("Creating project member for the project admin");

  const projectMember = await ProjectMember.create({
    project: project._id,
    role: UserRolesEnum.PROJECT_ADMIN,
    user: createdBy,
  });

  if (!projectMember) {
    logger.error("Unable to create projectMember for project admin");
    throw new ApiError(500, "Unable to create projectMember");
  }
  logger.info("Project member created successfully for project admin");

  return { project, projectMember };
};

export const getAllProjectsService = async (userId) => {
  logger.info(`Attemp to find projects : Checking if user is a member of any projects - ${userId}`);
  const memberships = await ProjectMember.find({ user: userId });

  if (!memberships) {
    logger.warn(`Failed to get projects : No projects found for - ${userId}`);
    throw new ApiError(401, "Memberships not found, Not a member of any project");
  }

  const memberProjectIds = memberships.map((m) => m.project.toString());

  const projects = await Project.find({
    $or: [{ createdBy: userId }, { _id: { $in: memberProjectIds } }],
  }).populate("createdBy", "fullname username email avatarUrl isEmailVerified");

  if (!projects) {
    logger.warn(`Failed to fetch projects : No projects found for user - ${userId}`);
    throw new ApiError(401, "Projects not found for the user");
  }

  logger.info(`Project fetch successfull : Find all projects for - ${userId}`);

  return projects;
};

export const getProjectByIdService = async (projectId) => {
  logger.info(`Attempt to fetch project : Finding project - ${projectId}`);
  const project = await Project.findById(projectId).populate(
    "createdBy",
    "fullname username email avatarUrl isEmailVerified"
  );

  if (!project) {
    logger.warn(`Failed to fetch project : Project not found - ${projectId}`);
    throw new ApiError(404, "Porject not found with this project id");
  }

  logger.info(`Project fetched successfull : Project found - ${project.name}`);

  return project;
};

export const updateProjectService = async ({ projectId, name, description }) => {
  logger.info(`Attempt to update project : Finding project - ${projectId}`);
  const project = await Project.findById(projectId);
  if (!project) {
    logger.warn(`Failed to update project : Project not found - ${projectId}`);
    throw new ApiError(404, "Project not found with this project id");
  }

  logger.info(`Project found : Updating project - ${projectId}`);
  project.name = name;
  project.description = description;
  const updatedProject = await project.save();

  if (!updatedProject) {
    logger.error(`Failed to update project : Unable to update project - ${projectId}`);
    throw new ApiError(404, "Unauthorized or project not found");
  }

  logger.info(`Project updated successfully : Project - ${projectId}`);

  return updatedProject;
};

export const addProjectMemberService = async ({ email, projectId, role }) => {
  logger.info(`Attempt to add member : Finding user with email - ${email}`);

  const user = await User.findOne({ email });

  if (!user) {
    logger.warn(`Failed to add member : User not found with email - ${email}`);
    throw new ApiError(404, "User not found! Invalid email");
  }

  logger.info(`User found : Adding member to project - ${projectId}`);

  const memberExists = await ProjectMember.findOne({
    project: projectId,
    user: user._id.toString(),
  });

  if (memberExists) {
    logger.warn(`Failed to add member : Member already exists in project - ${projectId}`);
    throw new ApiError(409, "Member already exists in this project");
  }

  const member = await ProjectMember.create({
    role,
    project: projectId,
    user: user._id.toString(),
  });

  await member.populate("user", "fullname username avatarUrl isEmailVerified");
  await member.populate("project", "name description createdBy");

  if (!member) {
    logger.error(`Failed to add member : Unable to add member in project - ${projectId}`);
    throw new ApiError(500, "Unable to add member in the project");
  }

  await Notification.create({
    user: user._id,
    type: NotificationTypesEnum.INFO,
    content: `You have been added as a member in project - ${member.project.name}`,
    project: projectId,
  });

  logger.info(
    `Member added successfully : Member - ${user.username} added to project - ${projectId}`
  );
  return { member };
};

export const removeProjectMemberService = async ({ projectId, memberId }) => {
  logger.info(`Attempt to remove member : Finding user with memberId - ${memberId}`);

  logger.info(`User found : Removing member from project - ${projectId}`);

  const member = await ProjectMember.findOneAndDelete({
    _id: memberId,
    project: projectId,
  })
    .populate("user", "fullname username avatarUrl isEmailVerified")
    .populate("project", "name description createdBy");

  if (!member) {
    logger.warn(`Failed to remove member : Member not found in project - ${projectId}`);
    throw new ApiError(404, "Member not found in this project");
  }
  logger.info(
    `Member removed successfully : Member - ${memberId} removed from project - ${projectId}`
  );
  return member;
};

export const getAllProjectMembersService = async (projectId) => {
  logger.info(`Attempt to fetch project members : Finding project - ${projectId}`);
  const members = await ProjectMember.find({ project: projectId })
    .populate("user", "fullname username avatarUrl isEmailVerified")
    .populate("project", "name description createdBy");

  if (!members) {
    logger.warn(`Failed to fetch members : No members found for project - ${projectId}`);
    throw new ApiError(404, "No members found for this project");
  }

  logger.info(`Project members fetched successfully : Project - ${projectId}`);

  return members;
};

export const updateMemberRoleService = async ({ memberId, role, projectId, userId }) => {
  logger.info(`Attempt to update member role : Finding member - ${memberId}`);

  const project = await Project.findById(projectId);
  if (!project) {
    logger.warn(`Failed to update member role : Project not found - ${projectId}`);
    throw new ApiError(404, "Project not found with this project id");
  }

  const member = await ProjectMember.findById(memberId)
    .populate("user", "fullname username avatarUrl isEmailVerified")
    .populate("project", "name description createdBy");

  if (!member) {
    logger.warn(`Failed to update member role : Member not found - ${memberId}`);
    throw new ApiError(404, "Member not found with this member id");
  }

  if (
    project.createdBy.toString() === member.user.toString() &&
    role !== UserRolesEnum.PROJECT_ADMIN
  ) {
    logger.warn(
      `Failed to update member role : Cannot change role of project admin - ${member.user}`
    );
    throw new ApiError(403, "Cannot change role of project admin");
  }

  if (member.role === role) {
    logger.warn(`Failed to update member role : Member already has this role - ${role}`);
    throw new ApiError(409, "Member already has this role");
  }

  member.role = role;
  const updatedMember = await member.save();

  if (!updatedMember) {
    logger.error(`Failed to update member role : Unable to update member - ${memberId}`);
    throw new ApiError(500, "Unable to update member role");
  }

  await Notification.create({
    user: member.user._id,
    type: NotificationTypesEnum.INFO,
    content: `Your role has been updated to ${role} in project - ${member.project.name}`,
    project: projectId,
  });

  logger.info(`Member role updated successfully : Member - ${memberId} with role - ${role}`);

  return updatedMember;
};

export const deleteProjectService = async (projectId, userId) => {
  logger.info(`Attempt to delete project : Finding project - ${projectId}`);

  const project = await Project.findOneAndDelete({ _id: projectId, createdBy: userId });

  if (!project) {
    logger.warn(`Failed to delete project : Project not found - ${projectId}`);
    throw new ApiError(404, "Project not found with this project id");
  }

  logger.info(`Project deleted successfully : Project - ${projectId}`);

  await ProjectMember.deleteMany({ project: projectId });
  logger.info(`All project members deleted successfully for project - ${projectId}`);

  return project;
};
