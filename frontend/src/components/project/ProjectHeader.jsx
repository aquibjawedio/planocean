import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { FolderKanban, CalendarDays, UserRound } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ProjectHeader = ({ project, createdBy }) => {
  return (
    <Card className="rounded-2xl shadow-md border bg-muted">
      <CardHeader className="space-y-2  ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderKanban className="text-muted-foreground w-6 h-6" />
            <CardTitle className="text-2xl font-semibold text-foreground">
              {project?.name}
            </CardTitle>
          </div>
        </div>

        <CardDescription className="text-muted-foreground text-sm">
          {project?.description}
        </CardDescription>

        <Separator />

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-0 pt-2">
          {/* Created At */}
          {project?.createdAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays size={16} />
              <span className="font-medium text-foreground">Created:</span>
              <span>
                {new Date(project.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}

          {/* Last Updated */}
          {project?.updatedAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays size={16} />
              <span className="font-medium text-foreground">Updated:</span>
              <span>
                {new Date(project.updatedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}


          {createdBy && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserRound size={16} />
              <span className="font-medium text-foreground">Created by:</span>
              <span>{createdBy}</span>
            </div>
          )}
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default ProjectHeader;
