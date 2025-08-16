import React from "react";
import { Card, CardContent } from "../ui/card";
import { FileText, FileCode2, Calendar, User, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const ListView = ({ tasks }) => {
  const navigate = useNavigate();

  const handleNavigate = (project, taskId) => {
    navigate(`/projects/${project}/tasks/${taskId}`);
  };

  const getAttachmentIcon = (mimetype) => {
    if (mimetype?.includes("pdf"))
      return <FileText size={14} className="text-muted-foreground" />;
    if (mimetype?.includes("javascript"))
      return <FileCode2 size={14} className="text-muted-foreground" />;
    return <FileText size={14} className="text-muted-foreground" />;
  };

  const statusStyles = {
    todo: "bg-yellow-100 text-yellow-700 border-yellow-200",
    in_progress: "bg-blue-100 text-blue-700 border-blue-200",
    done: "bg-green-100 text-green-700 border-green-200",
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

  const formatDate = (date) => {
    if (!date) return "No due date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4 bg-background rounded-lg">
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground px-2 py-4">
          No tasks available
        </p>
      ) : (
        tasks.map((task) => (
          <Card
            key={task._id}
            className="bg-card border rounded-xl hover:border-accent hover:shadow-md transition"
          >
            <CardContent className="text-sm text-muted-foreground p-4 space-y-3">
              {/* Title */}
              <h1
                className="text-base font-semibold text-foreground hover:underline cursor-pointer"
                onClick={() => handleNavigate(task.project, task._id)}
              >
                {task.title}
              </h1>

              {task.description && (
                <p className="line-clamp-2 text-muted-foreground">
                  {task.description}
                </p>
              )}

              {task.attachments?.length > 0 && (
                <div className="space-y-1">
                  {task.attachments.map((file) => (
                    <a
                      key={file._id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs hover:underline"
                    >
                      {getAttachmentIcon(file.mimetype)}
                      <span className="truncate">
                        {file?.url?.split("/").pop()}
                      </span>
                    </a>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium border ${
                      statusStyles[task.status] ||
                      "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {task.status.replace("_", " ")}
                  </span>

                  {task.priority && (
                    <span
                      className={`flex items-center gap-1 text-xs font-medium ${
                        priorityConfig[task.priority]?.color
                      }`}
                    >
                      {priorityConfig[task.priority]?.icon}
                      {task.priority}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
                  {task.labels?.map((label, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-0.5 rounded-md text-xs font-medium border bg-purple-100 text-purple-700 border-purple-200"
                    >
                      {label}
                    </span>
                  ))}

                  {task.dueDate && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border bg-slate-100 text-slate-700 border-slate-200">
                      <Calendar size={12} />
                      {formatDate(task.dueDate)}
                    </span>
                  )}
                </div>

                <div>
                  {task.assignedTo && (
                    <div className="flex gap-2 items-center pt-2">
                      <span className="text-xs">Assigned To :</span>
                      <div className="flex items-center gap-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignedTo.avatarUrl} />
                          <AvatarFallback>
                            {task.assignedTo.fullname
                              ? task.assignedTo.fullname[0]
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {task.assignedTo.fullname}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ListView;
