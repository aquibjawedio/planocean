import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useParams } from "react-router-dom";
import { addMemberSchema } from "@/schemas/memberSchema";
import { useMemberStore } from "@/stores/memberStore";

const AddMemberDialog = () => {
  const [open, setOpen] = useState(false);
  const { projectId } = useParams();

  const { addMember } = useMemberStore();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  useEffect(() => {
    if (projectId) {
      setValue("projectId", projectId);
    }
  }, [projectId, setValue]);

  const onSubmit = async (data) => {
    const formData = {
      role: data.role,
      email: data.email.trim(),
    };

    await addMember({ projectId, formData });
    console.log("Submitting form data:", formData);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} className="rounded-none">
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 px-3 py-1.5 border-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Add Member</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Invite a user to this project with a specific role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              {...register("email")}
              placeholder="name@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <Select
              onValueChange={(value) => setValue("role", value)}
              defaultValue="member"
            >
              <SelectTrigger id="role" className="cursor-pointer">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Project Member</SelectItem>
                <SelectItem value="project_admin">Project Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full cursor-pointer">
              {isSubmitting ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddMemberDialog };
