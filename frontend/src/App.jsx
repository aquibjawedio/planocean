import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useAuthStore } from "./stores/authStore";
import { useThemeStore } from "./stores/themeStore";

const App = () => {
  const { user, fetchUserProfile } = useAuthStore();

  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (!user) {
      (async () => {
        try {
          await fetchUserProfile();
        } catch (error) {
          console.log("ERROR IN FETCHING PROFILE : ", error);
        }
      })();
    }
  }, [user, fetchUserProfile]);
  return <AppRouter />;
};

export default App;
