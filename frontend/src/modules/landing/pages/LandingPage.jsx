import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowRight, Shield, Lock, Users, Zap } from "lucide-react";
import { axiosClient } from "@/api/axiosClient";

const LandingPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      setIsAuthenticated(false);
      const res = await axiosClient.get("/user/profile");
      setIsAuthenticated(true);
      console.log("RES : ", res);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted px-32 ">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">SecureApp</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Button asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link to="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth/register">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Secure Authentication Made Simple
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A modern, secure authentication system built with React, featuring
              robust user management, OAuth integration, and beautiful UI
              components.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button
                  size="lg"
                  asChild
                  className="transition-all hover:scale-105"
                >
                  <Link to="/dashboard">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    asChild
                    className="transition-all hover:scale-105"
                  >
                    <Link to="/auth/register">
                      Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/auth/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
