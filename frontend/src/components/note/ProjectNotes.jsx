import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { useParams } from "react-router-dom";
import SpinLoader from "../shared/SpinLoader";
import { noteSchema } from "@/schemas/noteSchema";

import TextAreaField from "../fields/TextAreaField";
import { useNoteStore } from "@/stores/noteStore";

const ProjectNotes = () => {
  const { projectId } = useParams();

  const { isLoading, fetchAllNotes, createNote, notes } = useNoteStore();
  console.log("Notes in ProjectNotes:", notes);

  useEffect(() => {
    if (notes === null) {
      fetchAllNotes(projectId);
    }
  }, [projectId, fetchAllNotes, notes]);

  const methods = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: "",
    },
    mode: "onTouched",
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (formData) => {
    await createNote(projectId, formData);
    console.log("Note created : ", formData);
    reset();
  };

  if (isLoading && notes === null) {
    return (
      <div className="flex items-center justify-center">
        <SpinLoader />
        <span>Loading notes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 max-w-7xl gap-6 mx-auto">
      <div className="w-full max-w-3xl mx-auto">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <TextAreaField
              name="content"
              label="Add a Note"
              rows={1}
              placeholder="Write your note here..."
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Adding note..." : "Add Note"}
            </Button>
          </form>
        </FormProvider>
      </div>

      <Card className="">
        <CardHeader>
          <CardTitle>Project Notes</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <ScrollArea className="max-h-[400px] pr-2">
            <div className="space-y-4">
              {notes?.length === 0 ? (
                <p className="text-muted-foreground text-sm">No notes yet.</p>
              ) : (
                notes?.map(
                  (note) =>
                    note && (
                      <div
                        key={note._id}
                        className="p-4 rounded-md border bg-muted/50"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={note?.createdBy[0]} />
                            <AvatarFallback>
                              {note.createdBy.name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <p className="font-medium">{note.createdBy.name}</p>
                            <p className="text-muted-foreground text-xs">
                              {note.createdAt}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground">
                          {note.content}
                        </p>
                      </div>
                    )
                )
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {notes && (
          <CardFooter className="justify-center text-xs text-muted-foreground">
            Showing {notes.length} note{notes.length !== 1 && "s"}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ProjectNotes;
