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
} from "lucide-react";

const getFileIcon = (mimetype) => {
  if (mimetype.includes("pdf")) return <FileText size={16} />;
  if (mimetype.includes("javascript")) return <FileCode2 size={16} />;
  if (mimetype.includes("image")) return <FileImage size={16} />;
  return <FileText size={16} />;
};

const TaskHeader = ({ task, project, assignedTo, assignedBy }) => {
  return (
    <Card className="rounded-2xl shadow-md border bg-muted">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold text-foreground">
            {task?.title}
          </CardTitle>
          <Badge
            variant="outline"
            className="text-xs font-medium capitalize px-2 py-1"
          >
            {task?.status || "todo"}
          </Badge>
        </div>

        {task?.description && (
          <CardDescription className="text-muted-foreground text-sm">
            {task.description}
          </CardDescription>
        )}

        <Separator />

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-0">
          {/* Assigned To */}
          {assignedTo && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserRound size={16} />
              <span className="font-medium text-foreground">Assigned to:</span>
              <span>{assignedTo}</span>
            </div>
          )}

          {/* Assigned By */}
          {assignedBy && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserRound size={16} />
              <span className="font-medium text-foreground">Assigned by:</span>
              <span>{assignedBy}</span>
            </div>
          )}

          {/* Project */}
          {project && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FolderKanban size={16} />
              <span className="font-medium text-foreground">Project:</span>
              <span>{project}</span>
            </div>
          )}

          {/* Created At */}
          {task?.createdAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
              <span className="font-medium text-foreground">Created:</span>
              <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </CardContent>

        {/* Attachments */}
        {task?.attachments?.length > 0 && (
          <CardFooter className="flex flex-col gap-2 items-start p-0">
            <span className="text-sm font-medium text-foreground">
              Attachments:
            </span>
            <div className="flex  gap-4 w-full">
              {task.attachments.map((file) => (
                <a
                  key={file._id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:underline"
                >
                  {getFileIcon(file.mimetype)}
                  <span className="truncate">{file.url.split("/").pop()}</span>
                </a>
              ))}
            </div>
          </CardFooter>
        )}
      </CardHeader>
    </Card>
  );
};

export default TaskHeader;
