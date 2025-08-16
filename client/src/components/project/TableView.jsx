import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { FileText, FileCode2, Calendar, Flag, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const TableView = ({ tasks }) => {
  const navigate = useNavigate();

  const handleNavigate = (project, taskId) => {
    navigate(`/projects/${project}/tasks/${taskId}`);
  };

  const getAttachmentIcon = (mimetype) => {
    if (mimetype?.includes("pdf"))
      return <FileText size={14} className="text-muted-foreground" />;
    if (mimetype?.includes("javascript"))
      return <FileCode2 size={14} className="text-muted-foreground" />;
    return <FileText size={14} className="text-muted-foreground" />;
  };

  const statusColor = {
    todo: "text-yellow-600",
    in_progress: "text-blue-600",
    done: "text-green-600",
  };

  const priorityConfig = {
    low: {
      color: "text-green-600",
      icon: <Flag size={14} fill="currentColor" className="text-green-600" />,
    },
    medium: {
      color: "text-yellow-600",
      icon: <Flag size={14} fill="currentColor" className="text-yellow-600" />,
    },
    high: {
      color: "text-red-600",
      icon: <Flag size={14} fill="currentColor" className="text-red-600" />,
    },
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-xl border p-4">
      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground text-sm">
            <TableHead className="w-[200px]">Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Priority</TableHead>
            <TableHead className="text-center">Labels</TableHead>
            <TableHead className="text-center">Due Date</TableHead>
            <TableHead className="text-center">Assigned To</TableHead>
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
                {task.description || "—"}
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

              <TableCell className="text-center">
                {task.priority ? (
                  <span
                    className={`flex items-center justify-center gap-1 text-xs font-medium ${
                      priorityConfig[task.priority]?.color
                    }`}
                  >
                    {priorityConfig[task.priority]?.icon}
                    {task.priority}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>

              <TableCell className="text-center">
                {task.labels?.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-1">
                    {task.labels.map((label, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-xs font-medium border bg-purple-100 text-purple-700 border-purple-200"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>

              <TableCell className="text-center">
                {task.dueDate ? (
                  <span className="flex items-center justify-center gap-1 text-xs ">
                    <Calendar size={12} />
                    {formatDate(task.dueDate)}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>

              <TableCell className="text-center">
                {task.assignedTo ? (
                  <div className="flex items-center justify-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignedTo.avatarUrl} />
                      <AvatarFallback>
                        {task.assignedTo.fullname
                          ? task.assignedTo.fullname[0]
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {task.assignedTo.fullname}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
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
                      <span className="truncate">
                        {a.url?.split("/").pop()}
                      </span>
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
