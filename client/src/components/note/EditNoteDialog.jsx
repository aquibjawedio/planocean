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
import { Textarea } from "../ui/textarea";

import { useParams } from "react-router-dom";

import { useNoteStore } from "@/stores/noteStore";
import { editNoteSchema } from "@/schemas/noteSchema";

const EditNoteDialog = ({
  open = false,
  onOpenChange = () => {},
  note = {},
}) => {
  const { projectId } = useParams();
  const { editNote } = useNoteStore();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editNoteSchema),
    defaultValues: {
      content: note?.content || "",
      projectId: projectId ?? "",
    },
  });

  useEffect(() => {
    if (projectId) {
      setValue("projectId", projectId);
    }
    if (note?.content) {
      setValue("content", note.content);
    }
  }, [projectId, note, setValue]);

  const onSubmit = async (data) => {
    if (data.content === note.content) {
      onOpenChange(false);
      reset();
      return;
    }
    const formData = {
      noteId: note._id,
      projectId: data.projectId,
      content: data.content,
    };

    await editNote(formData);

    console.log("Edited note:", formData);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm p-5">
        <DialogHeader className="mb-2 text-center">
          <DialogTitle className="text-base font-semibold">
            Edit Note
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Update the note content. Changes are saved automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="content" className="text-sm">
              Note
            </Label>
            <Textarea
              id="content"
              className="min-h-[100px] text-sm resize-y cursor-text"
              placeholder="Enter note content..."
              {...register("content")}
            />
            {errors.content && (
              <p className="text-xs text-red-500">{errors.content.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full h-9 text-sm cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteDialog;
