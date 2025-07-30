import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  ProjectorIcon,
  Github,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/themeStore";

import LogoutDialog from "../auth/LogoutButton";
import { Badge } from "../ui/badge";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "../ui/avatar";
import { useAuthStore } from "@/stores/authStore";

const Navbar = () => {
  const { theme, toggleTheme } = useThemeStore();

  const { user } = useAuthStore();

  const navigate = useNavigate();

  return (
    <nav className="w-full border-b bg-background shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <Link to="/" className="text-xl font-bold text-primary">
          PlanOcean
        </Link>

        {/* Right: Icons and Menu */}
        <div className="flex items-center gap-4">
          {/* Notification Button */}
          <Button
            size="icon"
            variant="ghost"
            className="relative rounded-full p-2 cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute top-1 right-1 inline-flex items-center justify-center px-1 py-0.5 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
              3
            </Badge>
          </Button>

          {/* GitHub repo button */}
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full cursor-pointer"
          >
            <a
              href="https://github.com/aquibjawedio/planocean"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-full w-full"
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>

          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage
                  src={user?.avatarUrl || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                className="cursor-pointer p-2.5"
                onClick={() => navigate("/profile")}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer p-2.5"
                onClick={() => navigate("/projects")}
              >
                <ProjectorIcon className="w-4 h-4 mr-2" />
                Projects
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer p-2.5"
                onClick={() => navigate("/user/settings")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <LogoutDialog />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
