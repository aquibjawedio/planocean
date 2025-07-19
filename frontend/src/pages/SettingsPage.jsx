import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/authStore";
import { passwordSchema, personalSchema } from "@/schemas/userSchema";
import AvatarUpdate from "@/components/user/AvatarUpdate";

export default function SettingsPage() {
  const listTabs = [
    { value: "avatar", label: "Avatar" },
    { value: "personal", label: "Personal" },
    { value: "security", label: "Security" },
  ];

  const { user } = useAuthStore();

  const personalForm = useForm({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      fullname: user?.fullname || "",
      username: user?.username || "",
      bio: user?.bio || "",
      website: user?.website || "",
      github: user?.github || "",
      linkedin: user?.linkedin || "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  return (
    <div className="max-w-3xl mx-auto px-4  space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      <Tabs defaultValue="avatar" className="space-y-6 w-full">
        <TabsList className="grid w-full grid-cols-3">
          {listTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="cursor-pointer"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Avatar Tab */}
        <TabsContent value="avatar">
          <AvatarUpdate />
        </TabsContent>

        {/* Personal Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal & Social</CardTitle>
              <CardDescription>
                Update your name, username, bio, and social links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={personalForm.handleSubmit((data) =>
                  console.log("Personal/Social Info:", data)
                )}
                className="space-y-4"
              >
                <Input
                  {...personalForm.register("fullname")}
                  placeholder="Full Name"
                />
                <Input
                  {...personalForm.register("username")}
                  placeholder="Username"
                />
                <Input {...personalForm.register("bio")} placeholder="Bio" />
                <Separator />
                <Input
                  {...personalForm.register("website")}
                  placeholder="Website"
                />
                <Input
                  {...personalForm.register("github")}
                  placeholder="GitHub URL"
                />
                <Input
                  {...personalForm.register("linkedin")}
                  placeholder="LinkedIn URL"
                />
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Change your email and password here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={passwordForm.handleSubmit((data) =>
                  console.log("Password Update:", data)
                )}
                className="space-y-4"
              >
                <Input
                  type="email"
                  value={user?.email}
                  disabled
                  className="cursor-not-allowed bg-muted"
                />
                <Separator />
                <Input
                  type="password"
                  placeholder="Current Password"
                  {...passwordForm.register("currentPassword")}
                />
                <Input
                  type="password"
                  placeholder="New Password"
                  {...passwordForm.register("newPassword")}
                />
                <Button type="submit">Update Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
