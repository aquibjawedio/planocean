import React, { useEffect, useState } from "react";
import { Circle, CheckCircle, Trash2 } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import SpinLoader from "@/components/shared/SpinLoader";
import TaskHeader from "@/components/task/TaskHeader";
import CreateSubtaskDialog from "@/components/subtask/CreateSubtaskDialog";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

import { useParams } from "react-router-dom";
import { useTaskStore } from "@/stores/taskStore";
import { useSubTaskStore } from "@/stores/subTaskStore";

const TaskPage = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subtaskToDelete, setSubtaskToDelete] = useState(null);

  const { taskId, projectId } = useParams();
  const { task, fetchTask, isLoading } = useTaskStore();
  const { subtasks, fetchAllSubTasks, deleteSubtask, completeSubtask } =
    useSubTaskStore();

  useEffect(() => {
    if (task === null || task._id !== taskId) {
      fetchTask(projectId, taskId);
    }
    if (subtasks === null) {
      fetchAllSubTasks(projectId, taskId);
    }
  }, [taskId, task, projectId, subtasks, fetchTask, fetchAllSubTasks]);

  if (isLoading || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <SpinLoader />
        <p className="text-muted-foreground">Loading task...</p>
      </div>
    );
  }

  const handleCompleteToggle = async (subtaskId, currentState) => {
    await completeSubtask(projectId, taskId, subtaskId, !currentState);
    console.log(
      `Subtask ${subtaskId} marked as ${
        !currentState ? "completed" : "incomplete"
      }`
    );
  };

  const handleDelete = async () => {
    if (!subtaskToDelete) return;
    console.log("Deleting subtask:", subtaskToDelete);
    await deleteSubtask(projectId, taskId, subtaskToDelete);
  };

  return (
    <div className="min-h-screen bg-background flex justify-center py-10">
      <div className="w-full max-w-6xl space-y-6">
        <TaskHeader
          task={task}
          assignedBy={task?.assignedBy?.fullname}
          assignedTo={task?.assignedTo?.fullname}
          project={task?.project?.name}
        />

        <Card className="rounded-xl border bg-muted shadow-sm">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">Subtasks</CardTitle>
            <CreateSubtaskDialog parentTaskId={taskId} />
          </CardHeader>

          <CardContent className="space-y-3">
            {subtasks?.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No subtasks available.
              </p>
            ) : (
              subtasks?.map((subtask) => (
                <div
                  key={subtask._id}
                  className="group flex items-center justify-between gap-4 bg-background p-3 rounded-lg border hover:shadow-md transition"
                >
                  <div className="flex items-start gap-3 w-full">
                    <Checkbox
                      checked={subtask.isCompleted}
                      onCheckedChange={() =>
                        handleCompleteToggle(subtask._id, subtask.isCompleted)
                      }
                      className="mt-1"
                    />
                    <div className="flex flex-col w-full">
                      <p
                        className={`text-sm font-medium break-words ${
                          subtask.isCompleted
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {subtask.title}
                      </p>
                      {subtask.description && (
                        <p className="text-xs text-muted-foreground">
                          {subtask.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Created on{" "}
                        {new Date(subtask.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {subtask.isCompleted ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : (
                      <Circle size={18} className="text-muted-foreground" />
                    )}

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSubtaskToDelete(subtask._id);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-destructive hover:text-red-600 cursor-pointer hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Subtask"
        description="Are you sure you want to delete this subtask? This action cannot be undone."
        action={handleDelete}
        onCancel="Cancel"
        onConfirm="Delete"
      />
    </div>
  );
};

export default TaskPage;
