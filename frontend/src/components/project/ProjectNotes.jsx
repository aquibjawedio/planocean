import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { useParams } from "react-router-dom";
import SpinLoader from "../shared/SpinLoader";
import { noteSchema } from "@/schemas/noteSchema";

const ProjectNotes = () => {
  const { projectId } = useParams();

  const { notes, fetchAllProjectNotes, isLoading } = useProjectStore();

  useEffect(() => {
    if (!notes) {
      fetchAllProjectNotes(projectId);
    }
  }, [projectId, fetchAllProjectNotes, notes]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(noteSchema),
  });

  const onSubmit = (data) => {
    const newNote = {
      _id: crypto.randomUUID(),
      content: data.content,
      createdBy: {
        name: "Aquib Jawed",
        avatar: "",
      },
      createdAt: new Date().toISOString(),
    };
    console.log("New Note Data:", newNote);
    reset();
  };

  if (isLoading || !notes) {
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="content">Add a new note</Label>
            <Textarea
              id="content"
              placeholder="Write your thoughts here..."
              {...register("content")}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Add Note
          </Button>
        </form>
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
                notes?.map((note) => (
                  <div
                    key={note._id}
                    className="p-4 rounded-md border bg-muted/50"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={note.createdBy.avatar} />
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
                    <p className="text-sm text-foreground">{note.content}</p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="justify-center text-xs text-muted-foreground">
          Showing {notes.length} note{notes.length !== 1 && "s"}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectNotes;
