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
    });

    socket.on("member", (data) => {
      console.log("New member added:", data);
      toast(`New member added: ${data.message}`, {
        description: "Click to view details",
        action: {
          label: "View",
          onClick: () => console.log("View details"),
        },
      });
    });

    socket.on("note", (data) => {
      console.log("Note event received:", data);
      toast(`Note updated: ${data.message}`, {
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
  }, []);

  return <AppRouter />;
};

export default App;
