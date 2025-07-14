import { axiosClient } from "@/api/axiosClient";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Edit, Mail, Phone, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import SpinLoader from "@/components/shared/SpinLoader";

const DashboardPage = () => {
  const { user, getCurrentUser } = useAuthStore();

  useEffect(() => {
    getCurrentUser();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-900 px-4 py-10">
        <SpinLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background ">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.fullname}!
          </h1>
          <p className="text-muted-foreground">
            Here's your account overview and recent activity
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Overview */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Profile Overview
                <Button variant="outline" size="sm" asChild>
                  <Link to="/profile">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </CardTitle>
              <CardDescription>
                Your account information and details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={user?.avatarUrl}
                    alt={`${user?.fullname}`}
                    className="rounded-full"
                  />
                  <AvatarFallback className="text-lg">
                    {user?.fullname}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{user?.fullname}</h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <p>{user?.username}</p>
                    </div>
                    <p className="text-muted-foreground">
                      {user?.bio || "No bio provided"}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user?.email}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {user?.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>
                Your account verification and security status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Verified</span>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user?.isEmailVerified
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }`}
                >
                  {user?.isEmailVerified ? "Verified" : "Pending"}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Account Type</span>
                <div className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {user?.role || "User"}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Profile Completion</span>
                <span className="text-sm font-medium">
                  {Math.round(
                    (((user?.firstName ? 1 : 0) +
                      (user?.lastName ? 1 : 0) +
                      (user?.phone ? 1 : 0) +
                      (user?.bio ? 1 : 0) +
                      (user?.avatar ? 1 : 0)) /
                      5) *
                      100
                  )}
                  %
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  asChild
                >
                  <Link to="/profile">
                    <User className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Edit Profile</div>
                      <div className="text-xs text-muted-foreground">
                        Update your information
                      </div>
                    </div>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  asChild
                >
                  <Link to="/settings">
                    <Mail className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Account Settings</div>
                      <div className="text-xs text-muted-foreground">
                        Email and password
                      </div>
                    </div>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  disabled
                >
                  <Calendar className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Activity Log</div>
                    <div className="text-xs text-muted-foreground">
                      Coming soon
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  disabled
                >
                  <User className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Preferences</div>
                    <div className="text-xs text-muted-foreground">
                      Coming soon
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
