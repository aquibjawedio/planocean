import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import LandingPage from "@/pages/LandingPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import ProfilePage from "@/pages/ProfilePage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProjectPage from "@/pages/ProjectPage";
import TaskPage from "@/pages/TaskPage";
import Layout from "../layout/Layout";
import SettingsPage from "@/pages/SettingsPage";
import { useAuthStore } from "@/stores/authStore";
import VerifyEmail from "@/components/auth/VerifyEmail";
import SendVerificationEmail from "@/pages/SendVerificationEmail";
import ProjectDashboardPage from "@/pages/ProjectDashboardPage";

const AppRouter = () => {
  const { user } = useAuthStore();

  return (
    <div className="bg-background">
      <Routes>
        <Route
          path="/auth/register"
          element={user ? <Navigate to="/profile" /> : <RegisterPage />}
        />
        <Route
          path="/auth/verify/:token"
          element={user ? <Navigate to="/profile" /> : <VerifyEmail />}
        />

        <Route
          path="/auth/resend"
          element={
            user ? <Navigate to="/profile" /> : <SendVerificationEmail />
          }
        />

        <Route
          path="/auth/login"
          element={user ? <Navigate to="/profile" /> : <LoginPage />}
        />
        <Route path="/auth/forgot" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset/:token" element={<ResetPasswordPage />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="projects"
            element={
              <ProtectedRoute>
                <ProjectDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="projects/:projectId"
            element={
              <ProtectedRoute>
                <ProjectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="projects/:projectId/tasks/:taskId"
            element={
              <ProtectedRoute>
                <TaskPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default AppRouter;
