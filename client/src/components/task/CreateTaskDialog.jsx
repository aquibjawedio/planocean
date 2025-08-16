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
import { CalendarDays, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { taskSchema } from "@/schemas/taskSchema";
import { useAuthStore } from "@/stores/authStore";
import { useParams } from "react-router-dom";
import { useTaskStore } from "@/stores/taskStore";
import { useMemberStore } from "@/stores/memberStore";
import { Calendar } from "../ui/calendar";

const CreateTaskDialog = () => {
  const [open, setOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date());
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
      assignedTo: user?._id || "",
    },
  });

  const [labels, setLabels] = useState([]);

  const handleKeyDown = (e) => {
    const input = e.target;
    const value = input.value.trim();

    if ((e.key === "Enter" || e.key === ",") && value) {
      e.preventDefault();

      if (!labels.includes(value)) {
        const newLabels = [...labels, value];
        setLabels(newLabels);
        setValue("labels", newLabels);
      }

      input.value = "";
    }
  };

  const removeLabel = (labelToRemove) => {
    const updated = labels.filter((label) => label !== labelToRemove);
    setLabels(updated);
    setValue("labels", updated);
  };
  useEffect(() => {
    if (!open) {
      reset();
      setLabels([]);
      setDate(new Date());
    }
  }, [open, reset]);

  const { createTask } = useTaskStore();

  const onSubmit = async (data) => {
    const formData = {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority || "low",
      dueDate: data.dueDate || null,
      labels: data.labels || [],
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

          <div className="space-y-1 relative">
            <Label htmlFor="dueDate">Due Date</Label>

            <div
              className="relative w-full"
              onClick={() => setShowCalendar((prev) => !prev)}
            >
              <Input
                id="dueDate"
                value={date ? date.toISOString().split("T")[0] : ""}
                placeholder="Select due date"
                readOnly
                className="pr-10 cursor-pointer"
              />
              <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" />
            </div>

            {showCalendar && (
              <div className="absolute top-0 bottom-0 z-50 shadow-md">
                <Calendar
                  mode="single"
                  selected={date ?? undefined}
                  onSelect={(val) => {
                    if (val) {
                      setDate(val);
                      setValue("dueDate", val.toISOString());
                    }
                    setShowCalendar(false);
                  }}
                  initialFocus
                />
              </div>
            )}
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
              <Label htmlFor="status">Priority</Label>
              <Select
                defaultValue="low"
                onValueChange={(val) => setValue("priority", val)}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-500">
                  {errors.priority.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="status" className="flex justify-end">
                Members
              </Label>
              <Select
                defaultValue={user?.username || ""}
                onValueChange={(val) => setValue("assignedTo", val)}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select Member" />
                </SelectTrigger>
                {members && (
                  <SelectContent className="max-h-60">
                    {members?.map((member) => (
                      <SelectItem key={member._id} value={member.user._id}>
                        {member.user.username || member.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                )}
              </Select>

              {errors.assignedTo && (
                <p className="text-sm text-red-500">
                  {errors.assignedTo.message}
                </p>
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

          <div>
            <Label htmlFor="labels" className="block text-sm font-medium mb-1">
              Labels
            </Label>

            <div className="flex flex-wrap gap-2 mb-2">
              {labels.map((label) => (
                <span
                  key={label}
                  className="flex items-center gap-1 border rounded px-2 py-1 text-sm bg-muted/50"
                >
                  {label}
                  <button
                    type="button"
                    aria-label={`Remove label ${label}`}
                    onClick={() => removeLabel(label)}
                    className="text-gray-500 hover:text-black rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <Input
              type="text"
              id="labels"
              placeholder="Type and press Enter or , to add labels"
              onKeyDown={handleKeyDown}
              className="w-full"
              autoComplete="off"
            />

            <Input type="hidden" {...register("labels")} />

            {errors.labels && (
              <p className="text-sm text-red-500">{errors.labels.message}</p>
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
