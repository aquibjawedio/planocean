import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useAuthStore } from "./stores/authStore";
import { useThemeStore } from "./stores/themeStore";
import socket from "./api/socket";
import { toast } from "sonner";

const App = () => {
  const { user, fetchUserProfile } = useAuthStore();

  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (user === null) {
      (async () => {
        try {
          await fetchUserProfile();
        } catch (error) {
          console.log("ERROR IN FETCHING PROFILE : ", error);
        }
      })();
    }
  }, [user, fetchUserProfile]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected successfully");
      if (user) {
        socket.emit("joinRoom", user._id.toString());
      }
    });

    socket.on("member", (data) => {
      toast(data.message, {
        description: "Click to view details",
        action: {
          label: "View",
          onClick: () => console.log("View details"),
        },
      });
    });

    socket.on("note", (data) => {
      toast(data.message, {
        description: "Click to view details",
        action: {
          label: "View",
          onClick: () => console.log("View note details"),
        },
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, [user]);

  return <AppRouter />;
};

export default App;
