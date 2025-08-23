import KanbanView from "@/components/project/KanbanView";
import ListView from "@/components/project/ListView";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectMembers from "@/components/member/ProjectMembers";
import ProjectNotes from "@/components/note/ProjectNotes";
import TableView from "@/components/project/TableView";
import SpinLoader from "@/components/shared/SpinLoader";
import CreateTaskDialog from "@/components/task/CreateTaskDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Kanban, ListTodo, NotebookPen, Table, Users } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import { useProjectStore } from "@/stores/projectStore";
import { useTaskStore } from "@/stores/taskStore";
import socket from "@/api/socket";
import { useAuthStore } from "@/stores/authStore";

const ProjectPage = () => {
  const { projectId } = useParams();

  const {
    project,
    isLoading: projectLoading,
    fetchProject,
  } = useProjectStore();
  const {
    tasks: storeTasks,
    isLoading: tasksLoading,
    fetchAllTasks,
    updateTaskStatus,
  } = useTaskStore();

  const { user } = useAuthStore();

  const [localTasks, setLocalTasks] = useState([]);

  useEffect(() => {
    if (!projectId) return;
    fetchProject(projectId);
    fetchAllTasks(projectId);
  }, [projectId, fetchProject, fetchAllTasks]);

  useEffect(() => {
    if (project && projectId && user) {
      socket.emit("joinProjectRoom", projectId);
    }
  }, [project, projectId, user]);

  useEffect(() => {
    if (Array.isArray(storeTasks)) {
      setLocalTasks(storeTasks);
    }
  }, [storeTasks]);

  const persistStatus = useCallback(
    async (taskId, newStatus) => {
      try {
        await updateTaskStatus(taskId, newStatus, projectId);
      } catch (err) {
        fetchAllTasks(projectId);
        console.error("Failed to update task status:", err);
      }
    },
    [updateTaskStatus, fetchAllTasks, projectId]
  );

  const handleTaskMove = useCallback(
    (taskId, { source, destination }) => {
      if (!taskId || !destination) return;

      setLocalTasks((prev) => {
        const buckets = { todo: [], in_progress: [], done: [] };
        prev.forEach((t) => {
          if (buckets[t.status]) buckets[t.status].push(t);
        });

        const from = source?.status;
        const to = destination?.status;
        const fromIdx = source?.index ?? -1;
        const toIdx = destination?.index ?? -1;

        if (!from || !to || fromIdx < 0 || toIdx < 0) return prev;

        const fromArr = [...(buckets[from] || [])];
        const toArr = from === to ? fromArr : [...(buckets[to] || [])];

        const moved = fromArr[fromIdx];
        if (!moved) return prev;

        fromArr.splice(fromIdx, 1);

        const movedUpdated = { ...moved, status: to };
        toArr.splice(toIdx, 0, movedUpdated);

        const nextBuckets = {
          ...buckets,
          [from]: fromArr,
          [to]: toArr,
        };

        const next = [
          ...nextBuckets.todo,
          ...nextBuckets.in_progress,
          ...nextBuckets.done,
        ];

        return next;
      });

      persistStatus(taskId, destination.status);
    },
    [persistStatus]
  );

  const loading = projectLoading || tasksLoading;
  const noTasksYet = !loading && (!localTasks || localTasks.length === 0);

  if (loading && storeTasks === null) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-center">
        <SpinLoader />
        <span className="mt-2 text-foreground/70">
          Loading your tasks — just a moment...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center">
      <div className="w-full max-w-7xl space-y-6">
        <ProjectHeader project={project} createdBy={project?.createdBy} />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Tabs defaultValue="kanban" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList className="bg-background border rounded-md shadow-sm flex gap-1">
                <TabsTrigger
                  value="kanban"
                  className="data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Kanban size={16} />
                  Kanban
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2 cursor-pointer"
                >
                  <ListTodo size={16} />
                  List
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Table size={16} />
                  Table
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <TabsList className="bg-background border rounded-md shadow-sm flex gap-1">
                  <TabsTrigger
                    value="notes"
                    className="data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <NotebookPen />
                    Notes
                  </TabsTrigger>

                  <TabsTrigger
                    value="members"
                    className="data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <Users size={16} />
                    Members
                  </TabsTrigger>
                </TabsList>

                <CreateTaskDialog />
              </div>
            </div>

            <div className="mt-4">
              {!noTasksYet && (
                <>
                  <TabsContent value="kanban">
                    <KanbanView
                      tasks={localTasks}
                      onTaskMove={handleTaskMove}
                    />
                  </TabsContent>

                  <TabsContent value="list">
                    <ListView tasks={localTasks} />
                  </TabsContent>

                  <TabsContent value="table">
                    <TableView tasks={localTasks} />
                  </TabsContent>
                </>
              )}

              <TabsContent value="notes">
                <ProjectNotes />
              </TabsContent>

              <TabsContent value="members">
                <ProjectMembers />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
