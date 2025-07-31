import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Trash, Pencil } from "lucide-react";
import ConfirmDialog from "../shared/ConfirmDialog";
import EditNoteDialog from "./EditNoteDialog";
import { useState } from "react";
import { useNoteStore } from "@/stores/noteStore";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const NoteOptionsDropdown = ({ note }) => {
  const { user } = useAuthStore();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { projectId } = useParams();
  const { deleteNote, isLoading } = useNoteStore();

  const handleDeleteNote = async () => {
    await deleteNote({ projectId, noteId: note._id });
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Ellipsis className="w-5 h-5 cursor-pointer" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48" align="start">
          <DropdownMenuLabel className="flex items-center gap-2">
            Note Options
          </DropdownMenuLabel>

          <DropdownMenuItem
            disabled={
              !(
                user?._id === note?.createdBy?._id ||
                user?.role === "project_admin"
              )
            }
            onSelect={() => setEditDialogOpen(true)}
            className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-muted-foreground cursor-pointer transition-colors hover:bg-muted/50"
          >
            <Pencil className="w-4 h-4" />
            Edit Note
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={
              !(
                user?._id === note?.createdBy?._id ||
                user?.role === "project_admin"
              )
            }
            onSelect={() => setDeleteDialogOpen(true)}
            className="group flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-red-500 cursor-pointer transition-colors hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600"
          >
            <Trash className="w-4 h-4 text-red-500 group-hover:text-red-600" />
            <span className="group-hover:text-red-600">Delete Note</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        title="Delete Note"
        description={`Are you sure you want to delete this note? This action cannot be undone.`}
        onConfirm="Delete"
        onCancel="Cancel"
        action={handleDeleteNote}
        isLoading={isLoading}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />

      <EditNoteDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        note={note}
      />
    </>
  );
};

export default NoteOptionsDropdown;
