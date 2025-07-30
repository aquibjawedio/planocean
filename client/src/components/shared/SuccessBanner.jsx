import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CheckCircle } from "lucide-react";

const SuccessBanner = ({ message }) => {
  return (
    <Alert>
      <CheckCircle className="w-4 h-4 text-emerald-400" />
      <AlertTitle className="text-emerald-600">Success</AlertTitle>
      <AlertDescription className="text-emerald-500">
        {message || "Your operation was completed successfully."}
      </AlertDescription>
    </Alert>
  );
};

export default SuccessBanner;
