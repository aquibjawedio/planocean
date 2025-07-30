import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { useMemberStore } from "@/stores/memberStore";
import { useParams } from "react-router-dom";
import VerificationBadge from "../shared/VerificationBadge";
import { AddMemberDialog } from "./AddMemberDialog";

const roleLabel = {
  project_admin: "Admin",
  member: "Member",
};

const ProjectMembers = () => {
  const { members, isLoading, fetchAllMembers } = useMemberStore();
  const { projectId } = useParams();

  useEffect(() => {
    if (members === null) {
      fetchAllMembers(projectId);
    }
  }, [projectId, fetchAllMembers, members]);

  if (isLoading && members === null) {
    return (
      <div className="flex items-center justify-center">
        <span>Loading members...</span>
      </div>
    );
  }

  return (
    <Card className="max-w-7xl w-full mx-auto">
      <CardHeader className="flex items-center justify-between">
        <AddMemberDialog />
        <CardTitle className="text-lg font-semibold">Project Members</CardTitle>
      </CardHeader>

      <CardContent>
        <ScrollArea className="max-h-[400px] pr-2">
          <div className="space-y-4">
            {!members ? (
              <p className="text-muted-foreground text-sm">No members found.</p>
            ) : (
              members.map((member) => {
                const user = member.user;
                if (!user || typeof user !== "object") return null;

                return (
                  <div
                    key={member._id}
                    className="flex items-center justify-between border rounded-lg p-3 bg-muted/50 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatarUrl || ""} />
                        <AvatarFallback>
                          {user.fullname?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium leading-none">
                          {user.fullname || "Unknown User"}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {user.username || "@unknown"}
                        </p>
                        <VerificationBadge createdBy={user} />
                      </div>
                    </div>
                    <Badge
                      variant={
                        member.role === "project_admin"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {roleLabel[member.role]}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProjectMembers;
