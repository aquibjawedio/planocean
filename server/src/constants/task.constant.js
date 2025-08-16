export const TaskStatusEnum = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

export const TaskPriorityEnum = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export const AvailableTaskStatus = Object.values(TaskStatusEnum);
export const AvailableTaskPriorities = Object.values(TaskPriorityEnum);
