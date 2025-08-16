import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { FileText, FileCode2, Calendar, Tag, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

const KanbanView = ({ tasks }) => {
  const navigate = useNavigate();

  const handleNavigate = (project, taskId) => {
    navigate(`/projects/${project}/tasks/${taskId}`);
  };

  const columns = { todo: [], in_progress: [], done: [] };
  tasks.forEach((task) => {
    columns[task.status]?.push(task);
  });

  const columnTitles = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
  };

  const getAttachmentIcon = (mimetype) => {
    if (mimetype.includes("pdf"))
      return <FileText size={16} className="text-muted-foreground" />;
    if (mimetype.includes("javascript"))
      return <FileCode2 size={16} className="text-muted-foreground" />;
    return <FileText size={16} className="text-muted-foreground" />;
  };

  const priorityConfig = {
    low: {
      color: "text-green-600",
      icon: <Flag size={14} fill="currentColor" className="text-green-600" />,
    },
    medium: {
      color: "text-yellow-600",
      icon: <Flag size={14} fill="currentColor" className="text-yellow-600" />,
    },
    high: {
      color: "text-red-600",
      icon: <Flag size={14} fill="currentColor" className="text-red-600" />,
    },
  };

  return (
    <div className="flex gap-6 overflow-x-auto bg-background rounded-lg">
      {Object.entries(columns).map(([status, columnTasks]) => (
        <div key={status} className="w-[300px] flex-shrink-0">
          <Card className="bg-muted rounded-2xl border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground px-2">
                {columnTitles[status]}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-2">
              <ScrollArea className="min-h-[40vh] pr-2">
                <div className="flex flex-col gap-3 pb-2">
                  {columnTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground px-2">
                      No tasks
                    </p>
                  ) : (
                    columnTasks.map((task) => (
                      <Card
                        key={task._id}
                        className="bg-background shadow-sm rounded-xl border hover:border-accent hover:shadow-md transition"
                      >
                        <CardContent className="text-sm text-muted-foreground space-y-2 pt-0">
                          <h1
                            className="text-sm font-medium text-foreground hover:underline cursor-pointer"
                            onClick={() =>
                              handleNavigate(task.project, task._id)
                            }
                          >
                            {task.title}
                          </h1>
                          <p className="line-clamp-2">{task.description}</p>

                          {task.labels?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {task.labels.map((label, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  <Tag size={12} className="mr-1" />
                                  {label}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span
                              className={`flex items-center gap-1 text-xs font-medium ${
                                priorityConfig[task.priority]?.color
                              }`}
                            >
                              {priorityConfig[task.priority]?.icon}
                              {task.priority}
                            </span>

                            {task.dueDate && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <span>Due Date :</span>
                                <div className="flex items-center gap-1 ml-1">
                                  <Calendar size={12} />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </div>

                          {task.assignedTo && (
                            <div className="flex justify-between items-center pt-2">
                              <span className="text-xs">Assigned To :</span>
                              <div className="flex items-center gap-1">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={task.assignedTo.avatarUrl}
                                  />
                                  <AvatarFallback>
                                    {task.assignedTo.fullname[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                  {task.assignedTo.fullname}
                                </span>
                              </div>
                            </div>
                          )}

                          {task.attachments?.length > 0 && (
                            <div className="space-y-1 pt-2">
                              {task.attachments.map((file) => (
                                <a
                                  key={file._id}
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-xs text-muted-foreground hover:underline"
                                >
                                  {getAttachmentIcon(file.mimetype)}
                                  <span className="truncate">
                                    {file?.url?.split("/").pop()}
                                  </span>
                                </a>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default KanbanView;
