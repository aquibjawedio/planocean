import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowBigUpDash, Ellipsis, Trash, UserPen } from "lucide-react";
import ConfirmDialog from "../shared/ConfirmDialog";
import { useState } from "react";
import { useMemberStore } from "@/stores/memberStore";
import { useParams } from "react-router-dom";
import EditMemberRoleDialog from "./EditMemberRoleDialog";

const MemberOptionDropdown = ({ member }) => {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { removeMember, isLoading } = useMemberStore();
  const { projectId } = useParams();

  const handleRemoveMember = async () => {
    await removeMember({ projectId, memberId: member._id });
    setRemoveDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Ellipsis className="w-5 h-5 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel className="flex items-center gap-2">
            Member Controls
          </DropdownMenuLabel>

          <DropdownMenuItem
            onSelect={() => setEditDialogOpen(true)}
            className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-muted-foreground cursor-pointer transition-colors hover:bg-muted/50"
          >
            <UserPen />
            Edit Role
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={member.role === "project_admin"}
            onSelect={() => setRemoveDialogOpen(true)}
            className="group flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-red-500 cursor-pointer transition-colors hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600"
          >
            <Trash className="w-4 h-4 text-red-500 group-hover:text-red-600" />
            <span className="group-hover:text-red-600">Remove Member</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        title="Remove Member"
        description={`Are you sure you want to remove ${member.user.fullname}? This action cannot be undone.`}
        onConfirm="Remove"
        onCancel="Cancel"
        action={handleRemoveMember}
        isLoading={isLoading}
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
      />
      <EditMemberRoleDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        member={member}
      />
    </>
  );
};

export default MemberOptionDropdown;
