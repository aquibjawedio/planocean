import NotFound from "@/components/shared/NotFound";
import LoginPage from "@/modules/auth/pages/LoginPage";
import RegisterPage from "@/modules/auth/pages/RegisterPage";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import DashboardPage from "@/modules/dashboard/pages/DashboardPage";
import LandingPage from "@/modules/landing/pages/LandingPage";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

const AppRoutes = () => {
  const { isAuthenticated, getCurrentUser, isLoading } = useAuthStore();

  useEffect(() => {
    getCurrentUser();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-900 px-4 py-10">
        <SpinLoader />
      </div>
    );
  }

  return (
    <div className="dark">
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/auth/login"
          element={isAuthenticated ? <DashboardPage /> : <LoginPage />}
        />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Page not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
