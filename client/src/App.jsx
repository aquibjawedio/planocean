import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useAuthStore } from "./stores/authStore";
import { useThemeStore } from "./stores/themeStore";
import socket from "./api/socket";
import { toast } from "sonner";
import { useNoteStore } from "./stores/noteStore";
import { useMemberStore } from "./stores/memberStore";

const App = () => {
  const { user, fetchUserProfile } = useAuthStore();

  const { theme } = useThemeStore();
  const { fetchAllNotes } = useNoteStore();
  const { fetchAllMembers } = useMemberStore();

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
    const userId = user?._id?.toString();

    const handleConnect = () => {
      if (userId) {
        socket.emit("joinRoom", userId);
      }
    };

    const handleMember = async (data) => {
      toast(data.message, {
        action: {
          label: "OK",
        },
      });
      if (data) {
        await fetchAllMembers(data.projectId);
      }
    };

    const handleNote = async (data) => {
      toast(data.message, {
        action: {
          label: "OK",
        },
      });
      if (data) {
        await fetchAllNotes(data.projectId);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("member", handleMember);
    socket.on("note", handleNote);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("member", handleMember);
      socket.off("note", handleNote);
    };
  }, [fetchAllMembers, fetchAllNotes, user?._id]);

  return <AppRouter />;
};

export default App;
