import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useParams } from "react-router-dom";
import { editMemberRoleSchema } from "@/schemas/memberSchema";
import { useMemberStore } from "@/stores/memberStore";

const EditMemberRoleDialog = ({
  open = false,
  onOpenChange = () => {},
  member = {},
}) => {
  const { projectId } = useParams();

  const { editMemberRole } = useMemberStore();

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editMemberRoleSchema),
    defaultValues: {
      role: member?.role || "member",
      projectId: projectId ?? "",
    },
  });

  useEffect(() => {
    if (projectId) {
      setValue("projectId", projectId);
    }
  }, [projectId, setValue]);

  const onSubmit = async (data) => {
    const formData = {
      projectId: data.projectId,
      memberId: member._id,
      role: data.role,
    };

    await editMemberRole(formData);

    console.log("Submitting form data:", formData); 
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm p-5">
        <DialogHeader className="mb-2 flex items-center justify-center text-center">
          <DialogTitle className="text-base font-semibold">
            Edit Role for{" "}
            <span className="text-primary">{member?.name || "Member"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground text-center">
            Update the role for this member. Changes take effect immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1 flex items-center justify-between">
            <Label htmlFor="role" className="text-sm">
              {`${member.user?.fullname || "Member"}`}
            </Label>
            <Select
              onValueChange={(value) => setValue("role", value)}
              defaultValue={member?.role || "member"}
            >
              <SelectTrigger id="role" className="text-sm h-9 cursor-pointer">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member" className="cursor-pointer">
                  Project Member
                </SelectItem>
                <SelectItem value="project_admin" className="cursor-pointer">
                  Project Admin
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full h-9 text-sm cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberRoleDialog;
