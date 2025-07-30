import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import SpinLoader from "../shared/SpinLoader";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, fetchUserProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        try {
          await fetchUserProfile();
        } catch (error) {
          console.error("Auth check failed:", error);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [isAuthenticated, fetchUserProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <SpinLoader />
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}
