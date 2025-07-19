import KanbanView from "@/components/project/KanbanView";
import ListView from "@/components/project/ListView";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectMembers from "@/components/project/ProjectMembers";
import ProjectNotes from "@/components/project/ProjectNotes";
import TableView from "@/components/project/TableView";
import SpinLoader from "@/components/shared/SpinLoader";
import CreateTaskDialog from "@/components/task/CreateTaskDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useProjectStore } from "@/stores/projectStore";
import { useTaskStore } from "@/stores/taskStore";
import {
  Kanban,
  ListTodo,
  NotebookPen,
  Plus,
  Table,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const ProjectPage = () => {
  const { projectId } = useParams();

  const {
    project,
    isLoading,
    fetchProject,
    fetchAllMembers,
    members,
    notes,
    fetchAllProjectNotes,
  } = useProjectStore();

  const { tasks, fetchAllTasks } = useTaskStore();

  useEffect(() => {
    if (!tasks) {
      fetchAllTasks(projectId);
    }
    if (!project || project._id !== projectId) {
      fetchProject(projectId);
    }
    if (!members) {
      fetchAllMembers(projectId);
    }
    if (!notes) {
      fetchAllProjectNotes(projectId);
    }
  }, [
    tasks,
    fetchAllTasks,
    projectId,
    project,
    fetchProject,
    fetchAllMembers,
    members,
    fetchAllProjectNotes,
    notes,
  ]);

  if (isLoading || !project || !tasks) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <SpinLoader />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full px-6 py-8 flex justify-center">
      <div className="w-full max-w-7xl space-y-6">
        <ProjectHeader project={project} createdBy={project?.createdBy} />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Tabs defaultValue="kanban" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList className="bg-background border rounded-xl p-1 shadow-sm flex gap-2">
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
                <TabsList className="flex gap-2">
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
                    <Badge className="ml-1">
                      {members ? members.length : 0}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <Button
                  className="text-sm font-medium flex items-center gap-2 cursor-pointer"
                  onClick={() => console.log("Add Task Clicked")}
                >
                  <CreateTaskDialog />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <TabsContent value="kanban">
                <KanbanView tasks={tasks} />
              </TabsContent>

              <TabsContent value="list">
                <ListView tasks={tasks} />
              </TabsContent>

              <TabsContent value="table">
                <TableView tasks={tasks} />
              </TabsContent>

              <TabsContent value="notes">
                <ProjectNotes projectId={projectId} />
              </TabsContent>

              <TabsContent value="members">
                <ProjectMembers projectId={projectId} members={members} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
