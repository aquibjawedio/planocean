import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  px-4">
      <header className="text-center py-20">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-zinc-950 tracking-tight">
          Welcome to PlanOcean
        </h1>
        <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto text-gray-700">
          A modern project management tool to help you create, collaborate, and
          organize your work — securely and efficiently.
        </p>
        <Button asChild className="mt-8 px-8 py-4 text-lg rounded-md">
          <Link to="/auth/register">Get Started</Link>
        </Button>
      </header>
    </div>
  );
};

export default LandingPage;
