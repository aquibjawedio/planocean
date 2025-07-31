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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { createSubtaskSchema } from "@/schemas/subtaskSchema";
import { useSubTaskStore } from "@/stores/subTaskStore";

const CreateSubtaskDialog = () => {
  const [open, setOpen] = useState(false);
  const { projectId, taskId } = useParams();
  const { createSubtask } = useSubTaskStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createSubtaskSchema),
    defaultValues: {
      isCompleted: false,
    },
  });

  const onSubmit = async (data) => {
    const subtaskData = {
      ...data,
      isCompleted: false,
    };

    console.log("Creating subtask with data:", subtaskData);
    await createSubtask(projectId, taskId, subtaskData);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 flex cursor-pointer items-center justify-center rounded-md bg-accent-foreground  text-background border border-muted px-4 transition-colors">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Subtask</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Subtask</DialogTitle>
          <DialogDescription>
            Provide a title and description.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Integrate password reset"
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
              placeholder="Describe the subtask..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full cursor-pointer">
              Create Subtask
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubtaskDialog;
