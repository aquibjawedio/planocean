import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  FolderKanban,
  CalendarDays,
  UserRound,
  CircleCheck,
  CircleAlert,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";
import VerificationBadge from "../shared/VerificationBadge";

const ProjectHeader = ({ project, createdBy }) => {
  return (
    <Card className="rounded-2xl shadow-sm border bg-muted ">
      <CardHeader className="pb-0 mb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="text-muted-foreground w-5 h-5" />
            <CardTitle className="text-xl font-semibold text-foreground">
              {project?.name}
            </CardTitle>
          </div>
        </div>
        {project?.description && (
          <CardDescription className="mt-1 text-sm text-muted-foreground">
            {project.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <Separator className="my-2" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4 flex-wrap">
            {project?.createdAt && (
              <div className="flex items-center gap-1">
                <CalendarDays size={16} />
                <span className="text-foreground font-medium">Created:</span>
                <span>
                  {new Date(project.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}

            {project?.updatedAt && (
              <div className="flex items-center gap-1">
                <CalendarDays size={16} />
                <span className="text-foreground font-medium">Updated:</span>
                <span>
                  {new Date(project.updatedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          {createdBy && (
            <div className="flex items-center gap-2">
              <UserRound size={16} className="text-muted-foreground" />
              <span className="font-medium text-foreground">Owner : </span>

              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src={createdBy.avatarUrl || "/default-avatar.png"}
                    alt={createdBy.fullname}
                  />
                  <AvatarFallback>
                    {createdBy.fullname?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground">{createdBy.fullname}</span>
                <VerificationBadge createdBy={createdBy} />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectHeader;
