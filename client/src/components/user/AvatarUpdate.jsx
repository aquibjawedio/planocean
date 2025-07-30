import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const AvatarUpdate = () => {
  const { user } = useAuthStore();

  const { updateUserAvatar } = useAuthStore();

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    await updateUserAvatar(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avatar</CardTitle>
        <CardDescription>Upload your profile picture</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <Avatar className="w-20 h-20 border rounded-xl">
          <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} />
          <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
        </Avatar>
        <Input
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="cursor-pointer"
        />
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full cursor-pointer"
          onClick={() => console.log("Avatar updated")}
        >
          Update Avatar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AvatarUpdate;
