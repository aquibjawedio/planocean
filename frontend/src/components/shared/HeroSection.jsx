import { Rocket, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const HeroSection = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="bg-background py-20 sm:py-28 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
          Set Sail for Productive Waters with{" "}
          <span className="text-primary">PlanOcean</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          A calm, focused workspace where teams plan smarter, track tasks, and
          ship projects on time — beautifully.
        </p>

        <div className="mt-10 flex justify-center flex-wrap gap-4">
          <Button size="lg" asChild>
            <Link to={isAuthenticated ? "/profile" : "/auth/register"}>
              <Rocket className="mr-2 h-4 w-4" />
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
            </Link>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <a
              href="https://github.com/aquibjawedio/PlanOcean"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub Repo
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
