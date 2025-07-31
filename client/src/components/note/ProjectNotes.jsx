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
import { useParams } from "react-router-dom";
import SpinLoader from "../shared/SpinLoader";
import { noteSchema } from "@/schemas/noteSchema";

import { useNoteStore } from "@/stores/noteStore";
import { Textarea } from "../ui/textarea";
import { PlusIcon, PlusSquare, Save, ScrollText } from "lucide-react";
import NoteOptionsDropdown from "./NoteOptionsDropdown";

const ProjectNotes = () => {
  const { projectId } = useParams();

  const { isLoading, fetchAllNotes, createNote, notes } = useNoteStore();

  useEffect(() => {
    if (notes === null) {
      fetchAllNotes(projectId);
    }
  }, [projectId, fetchAllNotes, notes]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(noteSchema) });

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
        <form>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add a Note</CardTitle>
            </CardHeader>

            <CardContent>
              <Textarea
                placeholder="Write your note here..."
                {...register("content")}
                className="resize-none h-32"
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.content.message}
                </p>
              )}
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                className="cursor-pointer w-full"
              >
                <PlusIcon />
                Add Note
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>

      <Card className="shadow-sm border rounded-lg">
        <CardHeader className="">
          <CardTitle className="text-lg font-semibold">Project Notes</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-0">
          <ScrollArea className="h-[350px]">
            <div className="space-y-4 pr-3">
              {notes?.length === 0 || !notes ? (
                <div className="flex flex-col gap-2 items-center justify-center pt-6 text-muted-foreground text-sm italic">
                  <ScrollText />
                  <span>No notes available for this project.</span>
                  <span className="text-xs">Start by adding a note.</span>
                </div>
              ) : (
                notes &&
                notes?.map(
                  (note) =>
                    note && (
                      <div
                        key={note._id}
                        className="group relative rounded-lg border bg-muted/40 p-4 py-2 hover:shadow transition-shadow"
                      >
                        <div className="absolute top-3 right-3">
                          <NoteOptionsDropdown note={note} />
                        </div>

                        <p className="text-sm text-foreground leading-relaxed pr-8">
                          {note?.content}
                        </p>

                        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={note?.createdBy.avatarUrl} />
                            <AvatarFallback>
                              {note?.createdBy.fullname?.[0]?.toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {note?.createdBy.fullname}
                            </span>
                            <span>
                              {new Date(note?.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                )
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {notes && notes.length > 0 && (
          <CardFooter className="justify-center text-xs text-muted-foreground">
            Showing {notes.length} note{notes.length !== 1 && "s"}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ProjectNotes;
