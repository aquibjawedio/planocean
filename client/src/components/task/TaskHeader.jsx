import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  FileText,
  FileCode2,
  FileImage,
  UserRound,
  FolderKanban,
  Calendar,
  Paperclip,
} from "lucide-react";

const getFileIcon = (mimetype) => {
  if (mimetype.includes("pdf")) return <FileText size={16} />;
  if (mimetype.includes("javascript")) return <FileCode2 size={16} />;
  if (mimetype.includes("image")) return <FileImage size={16} />;
  return <FileText size={16} />;
};

const TaskHeader = ({ task, project, assignedTo, assignedBy }) => {
  return (
    <Card className="rounded-xl shadow-sm border bg-muted p-4">
      <CardHeader className="p-0 space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-foreground">
            {task?.title}
          </CardTitle>
          <Badge variant="outline" className="text-xs font-medium">
            {task?.status || "todo"}
          </Badge>
        </div>

        {task?.description && (
          <CardDescription className="text-sm text-muted-foreground">
            {task.description}
          </CardDescription>
        )}
      </CardHeader>

      <Separator className="" />

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-0">
        {assignedTo && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <UserRound size={14} />
            <span className="text-foreground">Assigned to:</span>
            <span>{assignedTo}</span>
          </div>
        )}

        {assignedBy && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <UserRound size={14} />
            <span className="text-foreground">Assigned by:</span>
            <span>{assignedBy}</span>
          </div>
        )}

        {project && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <FolderKanban size={14} />
            <span className="text-foreground">Project:</span>
            <span>{project}</span>
          </div>
        )}

        {task?.createdAt && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar size={14} />
            <span className="text-foreground">Created:</span>
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>

      {task?.attachments?.length > 0 && (
        <>
          <Separator className="my-2" />
          <CardFooter className="flex flex-col gap-1 items-start p-0">
            <div className="text-sm font-medium text-foreground flex items-center gap-1">
              <Paperclip size={14} />
              Attachments
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              {task.attachments.map(
                (file) =>
                  file && (
                    <a
                      key={file._id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:underline truncate"
                    >
                      {getFileIcon(file.mimetype)}
                      <span className="truncate">
                        {file.url.split("/").pop()}
                      </span>
                    </a>
                  )
              )}
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default TaskHeader;
