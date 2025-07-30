import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package } from "lucide-react";
import UserProfile from "@/components/user/UserProfile";
import { useProjectStore } from "@/stores/projectStore";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import CreateProjectDialog from "@/components/project/CreateProjectDialog";

const ProfilePage = () => {
  const { projects, isLoading, fetchAllProjects } = useProjectStore();
  const { user } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!projects) {
      fetchAllProjects();
    }
  }, [projects, fetchAllProjects]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 md:col-span-1">
          <UserProfile />
        </div>

        <div className="col-span-2">
          <Tabs defaultValue="allprojects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="allprojects" className="cursor-pointer">
                All Projects
              </TabsTrigger>
              <TabsTrigger value="createdproject" className="cursor-pointer">
                Created Projects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="allprojects">
              <Card>
                <CardContent className="pt-4">
                  {projects && projects.length > 0 ? (
                    <div>
                      <h2 className="text-lg font-semibold mb-4">
                        Your Projects
                      </h2>
                      <ul className="space-y-4">
                        {projects.map((project) => (
                          <li
                            key={project._id}
                            className="border p-4 rounded-lg cursor-pointer"
                            onClick={() => {
                              navigate(`/projects/${project._id}`);
                            }}
                          >
                            <h3 className="text-md font-bold">
                              {project.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {project.description}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No projects yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first project by clicking on create project.
                      </p>
                      <CreateProjectDialog />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="createdproject">
              <Card>
                <CardContent className="pt-4">
                  {projects && projects.length > 0 ? (
                    (() => {
                      const createdProjects = projects.filter(
                        (project) => project.createdBy._id === user._id
                      );

                      return createdProjects.length > 0 ? (
                        <div>
                          <h2 className="text-lg font-semibold mb-4">
                            Create Projects
                          </h2>
                          {createdProjects.map((project) => (
                            <div
                              key={project._id}
                              className="border p-4 rounded-lg cursor-pointer"
                              onClick={() => {
                                navigate(`/projects/${project._id}`);
                              }}
                            >
                              <h3 className="text-md font-bold">
                                {project.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {project.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                            No projects created yet
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Projects created by you will show up here.
                          </p>
                          <CreateProjectDialog />
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No projects created yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Projects created by you will show up here.
                      </p>
                      <CreateProjectDialog />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
