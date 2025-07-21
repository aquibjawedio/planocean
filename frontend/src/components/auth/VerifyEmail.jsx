import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import SpinLoader from "../shared/SpinLoader";
import { useAuthStore } from "@/stores/authStore";
import SuccessBanner from "../shared/SuccessBanner";
import ErrorBanner from "../shared/ErrorBanner";

const VerifyEmail = () => {
  const { token } = useParams();
  const { verifyEmail, error, isLoading } = useAuthStore();

  useEffect(() => {
    (async () => {
      await verifyEmail(token);
      console.log("Email verification initiated with token:", token);
    })();
  }, [verifyEmail, token]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <SpinLoader />
        <p className="text-gray-500">Verifying your email...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <ErrorBanner
          message={
            error?.response?.data.message ||
            "Invalid or expired token. Please initiate new token generation."
          }
        />
        <Link
          to={"/auth/login"}
          className="text-gray-200 hover:bg-zinc-800 bg-zinc-900 border rounded-md px-4 py-2 mt-4"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <SuccessBanner message="Email Verified Successfully! You can now log in to your account." />
      <Link
        to={"/auth/login"}
        className="text-gray-200 hover:bg-zinc-800 bg-zinc-900 border rounded-md px-4 py-2 mt-4"
      >
        Go to Login
      </Link>
    </div>
  );
};

export default VerifyEmail;
