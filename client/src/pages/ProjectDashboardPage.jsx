import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter, SortAsc, Calendar } from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";

import CreateProjectDialog from "@/components/project/CreateProjectDialog";
import { Link } from "react-router-dom";
import SpinLoader from "@/components/shared/SpinLoader";

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

const ProjectDashboardPage = () => {
  const { projects, isLoading, fetchAllProjects } = useProjectStore();

  useEffect(() => {
    if (projects === null) {
      fetchAllProjects();
    }
  }, [projects, fetchAllProjects]);

  if (isLoading) {
    return (
      <div>
        <SpinLoader />
        <p className="text-center text-gray-500">Loading projects...</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full p-6 ">
      <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 -translate-y-1/2 right-3" />
            <Input placeholder="Search projects..." className="w-full pl-10" />
          </div>

          <Select>
            <SelectTrigger className="w-[160px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Button variant="outline" className="">
            <SortAsc className="h-4 w-4" />
            Sort
          </Button>
        </div>
        <CreateProjectDialog />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {!projects ? (
          <p>No projects found</p>
        ) : (
          projects?.map((project, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {project.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="text-gray-500">
                  {project.description || "No description available."}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="align-middle">
                    Create on:{" "}
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="align-middle">
                    Updated on:{" "}
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <Link to={`/projects/${project._id}`} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full mt-2 cursor-pointer"
                  >
                    View Project
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default ProjectDashboardPage;
