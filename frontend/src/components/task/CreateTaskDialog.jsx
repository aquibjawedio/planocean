import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { taskSchema } from "@/schemas/taskSchema";
import { useAuthStore } from "@/stores/authStore";
import { useParams } from "react-router-dom";
import { useTaskStore } from "@/stores/taskStore";
import { useMemberStore } from "@/stores/memberStore";

const CreateTaskDialog = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();

  const { members, fetchAllMembers } = useMemberStore();
  const { projectId } = useParams();

  useEffect(() => {
    if (open && members === null) {
      fetchAllMembers(projectId);
    }
  }, [fetchAllMembers, members, projectId, open]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: "todo",
      assignedTo: members?.[0]._id || null,
    },
  });

  const { createTask } = useTaskStore();

  const onSubmit = async (data) => {
    const formData = {
      title: data.title,
      description: data.description,
      status: data.status,
      attachments: data.attachments
        ? Array.from(data.attachments).map((file) => ({
            filename: file.name,
            mimetype: file.type,
            size: file.size,
          }))
        : [],
      assignedTo: data.assignedTo || null,
      assignedBy: user?._id || null,
      project: projectId || null,
    };
    console.log("Task Form Data:", formData);
    await createTask(projectId, formData);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} className="rounded-none">
      <DialogTrigger asChild>
        <div className="gap-2 flex cursor-pointer items-center justify-center rounded-md bg-accent-foreground  text-background border border-muted px-4 transition-colors">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Task</span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add task details and upload attachments.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Finalize Logo Design"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the task..."
              {...register("description")}
            />
          </div>

          <div className="flex justify-between space-x-4">
            <div className="space-y-1">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue="todo"
                onValueChange={(val) => setValue("status", val)}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="status" className="flex justify-end">
                Members
              </Label>
              <Select
                defaultValue={members?.[0]._id}
                onValueChange={(val) => setValue("assignedTo", val)}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue
                    placeholder="Select member"
                  />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {members?.map((member) => (
                    <SelectItem key={member._id} value={member.user._id}>
                      {member.user.username || member.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="attachments">Attachments</Label>
            <Input
              id="attachments"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.svg"
              {...register("attachments")}
              className="file:text-sm file:font-medium file:cursor-pointer file:mr-4 file:border-0 file:bg-muted file:text-foreground hover:file:bg-accent"
            />
            {errors.attachments && (
              <p className="text-sm text-red-500">
                {errors.attachments.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full cursor-pointer">
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
