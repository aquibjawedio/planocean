import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { XCircle } from "lucide-react";

const ErrorBanner = ({ message }) => {
  return (
    <Alert variant="destructive" className="w-full max-w-md mx-auto">
      <XCircle className="w-4 h-4 text-red-500" />
      <AlertTitle className="text-red-600">Error</AlertTitle>
      <AlertDescription className="text-red-500">
        {message || "Something went wrong. Please try again."}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorBanner;
