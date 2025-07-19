import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjectStore } from "@/stores/projectStore";
import { useEffect } from "react";

const roleLabel = {
  project_admin: "Admin",
  member: "Member",
};

const ProjectMembers = () => {
  const { members, fetchAllMembers, isLoading } = useProjectStore();

  useEffect(() => {
    if (!members) {
      fetchAllMembers();
    }
  }, [members, fetchAllMembers]);

  if (isLoading || !members) {
    return (
      <div className="flex items-center justify-center">
        <span>Loading members...</span>
      </div>
    );
  }

  return (
    <Card className="max-w-7xl w-full mx-auto">
      <CardHeader>
        <CardTitle>Project Members</CardTitle>
      </CardHeader>

      <CardContent>
        <ScrollArea className="max-h-[400px] pr-2">
          <div className="space-y-4">
            {members.length === 0 ? (
              <p className="text-muted-foreground text-sm">No members found.</p>
            ) : (
              members.map((member) => {
                const user = member.user || {};

                return (
                  <div
                    key={member._id}
                    className="flex items-center justify-between border rounded-lg p-3 bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium leading-none">{user.name}</p>
                        <p className="text-muted-foreground text-xs">
                          ID: {member.user.slice(0, 6)}...
                        </p>
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
