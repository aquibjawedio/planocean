import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { FileText, FileCode2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TableView = ({ tasks }) => {
  const navigate = useNavigate();

  const handleNavigate = (project, taskId) => {
    navigate(`/projects/${project}/tasks/${taskId}`);
  };

  const getAttachmentIcon = (mimetype) => {
    if (mimetype.includes("pdf"))
      return <FileText size={16} className="text-muted-foreground" />;
    if (mimetype.includes("javascript"))
      return <FileCode2 size={16} className="text-muted-foreground" />;
    return <FileText size={16} className="text-muted-foreground" />;
  };

  const statusColor = {
    todo: "text-yellow-600",
    in_progress: "text-blue-600",
    done: "text-green-600",
  };

  return (
    <div className="rounded-xl border p-4">
      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground text-sm">
            <TableHead className="w-[200px]">Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="w-[220px]">Attachments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task._id} className="hover:bg-accent transition">
              <TableCell
                className="font-medium text-foreground hover:underline cursor-pointer"
                onClick={() => handleNavigate(task.project, task._id)}
              >
                {task.title}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-sm truncate">
                {task.description}
              </TableCell>
              <TableCell className="text-sm font-semibold text-center uppercase">
                <span
                  className={`${
                    statusColor[task.status] || "text-muted-foreground"
                  }`}
                >
                  {task.status.replace("_", " ")}
                </span>
              </TableCell>
              <TableCell className="space-y-1">
                {task.attachments?.length > 0 ? (
                  task.attachments.map((a) => (
                    <a
                      key={a._id}
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:underline"
                    >
                      {getAttachmentIcon(a.mimetype)}
                      <span className="truncate">{a.url?.split("/").pop()}</span>
                    </a>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No files
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableView;
