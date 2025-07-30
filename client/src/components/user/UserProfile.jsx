import { useAuthStore } from "@/stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // shadcn version
import {
  Building,
  Calendar,
  LinkIcon,
  Mail,
  MapPin,
  Loader2,
} from "lucide-react";
import React from "react";

const ProfileInfo = ({ icon, text, isLink = false }) => {
  if (!text) return null;

  return (
    <div className="flex items-center gap-3 text-muted-foreground text-sm">
      {icon}
      {isLink ? (
        <a
          href={text}
          className="hover:underline text-blue-600 dark:text-blue-400 truncate"
          target="_blank"
          rel="noopener noreferrer"
        >
          {text}
        </a>
      ) : (
        <span className="truncate">{text}</span>
      )}
    </div>
  );
};

const UserProfile = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    user && (
      <aside className="w-full lg:max-w-md mx-auto lg:mx-0 border border-border rounded-2xl shadow-sm px-6 py-8 dark:bg-zinc-900 lg:min-h-[80vh] h-fit">
        <div className="flex flex-col lg:items-start items-center gap-6">
          <Avatar className="w-28 h-28 border border-border rounded-xl">
            <AvatarImage
              src={user.avatarUrl || "/placeholder.svg"}
              alt={user.fullname}
              className="object-cover rounded-xl"
            />
            <AvatarFallback className="text-3xl font-medium rounded-xl">
              {user.fullname?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1 text-center lg:text-left w-full">
            <h2 className="text-2xl font-bold text-foreground">
              {user.fullname || "User"}
            </h2>
            <p className="text-muted-foreground text-sm">
              @{user.username || "username"}
            </p>
            {user.bio && (
              <p className="text-sm text-muted-foreground">{user.bio}</p>
            )}
          </div>

          <div className="space-y-3 w-full">
            <ProfileInfo
              icon={<Building className="w-4 h-4" />}
              text={user.company}
            />
            <ProfileInfo
              icon={<MapPin className="w-4 h-4" />}
              text={user.location}
            />
            <ProfileInfo
              icon={<LinkIcon className="w-4 h-4" />}
              text={user.website}
              isLink
            />
            <ProfileInfo
              icon={<Mail className="w-4 h-4" />}
              text={user.email}
            />
            <ProfileInfo
              icon={<Calendar className="w-4 h-4" />}
              text={
                user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : null
              }
            />
          </div>
        </div>
      </aside>
    )
  );
};

export default UserProfile;
