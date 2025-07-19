import {
  Compass,
  Waves,
  Clock,
  Users,
  Kanban,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: <Kanban className="w-6 h-6 text-primary" />,
    title: "Ocean-Smooth Workflows",
    desc: "Organize your tasks with intuitive Kanban boards that adapt like waves to your team’s flow.",
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: "Team Collaboration",
    desc: "Connect, assign, and collaborate seamlessly with everyone on your crew — no stormy confusion.",
  },
  {
    icon: <Compass className="w-6 h-6 text-primary" />,
    title: "Project Navigation",
    desc: "Effortlessly navigate across complex projects with a streamlined interface and global controls.",
  },
  {
    icon: <Clock className="w-6 h-6 text-primary" />,
    title: "Real-Time Updates",
    desc: "Track changes, progress, and discussions live, so no one misses the tide.",
  },
  {
    icon: <Waves className="w-6 h-6 text-primary" />,
    title: "Custom Workspaces",
    desc: "Create project spaces tailored to your flow — whether it’s a sprint or a marathon.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: "Secure by Default",
    desc: "Your data is protected like a vault under the sea — encrypted, backed up, and always yours.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-background py-20 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Why teams choose <span className="text-primary">PlanOcean</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Sail through productivity with tools designed to streamline
            collaboration, tracking, and goal setting.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-background border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition duration-500" />

              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-muted mb-4">
                {icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
