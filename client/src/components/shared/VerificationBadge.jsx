import { CircleAlert, CircleCheck } from "lucide-react";
import { Badge } from "../ui/badge";

const VerificationBadge = ({ createdBy }) => {
  return (
    <Badge variant="outline" className="text-[11px] px-1.5 py-0.5">
      {createdBy?.isEmailVerified ? "Verified" : "Unverified"}
      {createdBy?.isEmailVerified ? (
        <CircleCheck className="ml-1 w-4 h-4 text-green-500" />
      ) : (
        <CircleAlert className="ml-1 w-4 h-4 text-red-500" />
      )}
    </Badge>
  );
};

export default VerificationBadge;
