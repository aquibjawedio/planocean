import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowBigUpDash, Ellipsis, Trash2 } from "lucide-react";

const MemberOptionDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Ellipsis className="w-5 h-5 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="flex items-center gap-2">
          Member Controls
        </DropdownMenuLabel>

        <DropdownMenuItem>
          <ArrowBigUpDash />
          Update Role
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-500 hover:text-red-400 hover:bg-background ">
          <Trash2 className="text-red-500" />
          Remove Member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MemberOptionDropdown;
