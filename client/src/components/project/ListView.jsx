import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { FileText, FileCode2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ListView = ({ tasks }) => {
  const navigate = useNavigate();

  const handleNavigate = (project, taskId) => {
    navigate(`/projects/${project}/tasks/${taskId}`);
  };

  const getAttachmentIcon = (mimetype) => {
    if (mimetype.includes("pdf"))
      return <FileText size={16} className="text-muted-foreground" />;
    if (mimetype.includes("javascript"))
      return <FileCode2 size={16} className="text-muted-foreground" />;
    return <FileText size={16} className="text-muted-foreground" />;
  };

  const statusColor = {
    todo: "text-yellow-600",
    in_progress: "text-blue-600",
    done: "text-green-600",
  };

  return (
    <div className="space-y-4 bg-background rounded-lg">
      {tasks.map((task) => (
        <Card key={task._id} className="bg-muted border rounded-xl">
          <CardHeader className="py-0">
            <CardTitle
              className="text-base text-foreground hover:underline cursor-pointer"
              onClick={() => handleNavigate(task.project, task._id)}
            >
              {task.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>{task.description}</p>

            {task.attachments && task.attachments.length > 0 && (
              <div className="space-y-1">
                {task.attachments.map((file) => (
                  <a
                    key={file._id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:underline text-muted-foreground"
                  >
                    {getAttachmentIcon(file.mimetype)}
                    <span className="truncate">
                      {file?.url?.split("/").pop()}
                    </span>
                  </a>
                ))}
              </div>
            )}

            <p
              className={`text-xs font-medium uppercase ${
                statusColor[task.status] || "text-muted-foreground"
              }`}
            >
              {task.status.replace("_", " ")}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ListView;
