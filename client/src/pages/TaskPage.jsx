import React, { useEffect } from "react";

import { Circle, CheckCircle, File, Plus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useTaskStore } from "@/stores/taskStore";
import { useParams } from "react-router-dom";
import { useSubTaskStore } from "@/stores/subTaskStore";
import SpinLoader from "@/components/shared/SpinLoader";
import { Badge } from "@/components/ui/badge";
import TaskHeader from "@/components/task/TaskHeader";
import { Button } from "@/components/ui/button";

const TaskPage = () => {
  const { taskId } = useParams();
  const { projectId } = useParams();
  const { task, fetchTask, isLoading } = useTaskStore();
  const { subtasks, fetchAllSubTasks } = useSubTaskStore();

  useEffect(() => {
    if (!task || task._id !== taskId) {
      fetchTask(projectId, taskId);
    }
    if (!subtasks || task._id !== taskId) {
      fetchAllSubTasks(projectId, taskId);
    }
  }, [taskId, projectId, task, fetchTask, subtasks, fetchAllSubTasks]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <SpinLoader />
        <p className="text-muted-foreground">Loading task...</p>
      </div>
    );
  }

  console.log("Task data:", task);

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-7xl space-y-6">
        <TaskHeader
          task={task}
          assignedBy={task?.assignedBy?.fullname}
          assignedTo={task?.assignedTo?.fullname}
          project={projectId}
        />

        <Card className="rounded-xl border bg-muted shadow-sm">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">Subtasks</CardTitle>
            <Button className="w-fit cursor-pointer">
              <Plus />
              <span>Subtask</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {subtasks && subtasks.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No subtasks available.
              </p>
            )}
            {subtasks?.map((subtask) => (
              <div
                key={subtask._id}
                className="flex items-start gap-4 justify-between p-3 rounded-lg hover:bg-accent transition group"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={subtask.isCompleted}
                    className="mt-1"
                    disabled
                  />
                  <div className="flex flex-col">
                    <p
                      className={`text-sm font-medium ${
                        subtask.isCompleted
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {subtask.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created on{" "}
                      {new Date(subtask.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-muted-foreground">
                  {subtask.isCompleted ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <Circle size={16} />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskPage;
