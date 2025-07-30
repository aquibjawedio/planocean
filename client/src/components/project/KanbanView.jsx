import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { FileText, FileCode2 } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const KanbanView = ({ tasks }) => {
  const navigate = useNavigate();

  const handleNavigate = (project, taskId) => {
    navigate(`/projects/${project}/tasks/${taskId}`);
  };

  const columns = {
    todo: [],
    in_progress: [],
    done: [],
  };

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
                <div className="flex flex-col gap-4 pb-2">
                  {columnTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground px-2">
                      No tasks
                    </p>
                  ) : (
                    columnTasks.map((task) => (
                      <Card
                        key={task._id}
                        className="bg-background shadow-sm rounded-xl border hover:border-accent hover:shadow-md transition cursor-pointer"
                      >
                        <CardHeader className="py-0">
                          <CardTitle
                            className="text-sm font-medium text-foreground p-0 hover:underline"
                            onClick={() =>
                              handleNavigate(task.project, task._id)
                            }
                          >
                            {task.title}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="text-sm text-muted-foreground space-y-2 py-0">
                          <p className="line-clamp-3">{task.description}</p>

                          {task.attachments?.length > 0 && (
                            <div className="space-y-1 pt-1">
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
                                    {file.url?.split("/").pop()}
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
