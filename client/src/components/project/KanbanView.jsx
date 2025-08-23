import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  FileText,
  FileCode2,
  Calendar,
  Tag,
  Flag,
  GripVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const KanbanView = ({ tasks = [], onTaskMove }) => {
  const navigate = useNavigate();

  const handleNavigate = (project, taskId) => {
    navigate(`/projects/${project}/tasks/${taskId}`);
  };

  const columns = useMemo(() => {
    const map = { todo: [], in_progress: [], done: [] };
    tasks?.forEach((t) => {
      if (map[t.status]) map[t.status].push(t);
    });
    return map;
  }, [tasks]);

  const columnTitles = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
  };

  const formatDate = (date) => {
    if (!date) return "No due date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getAttachmentIcon = (mimetype = "") => {
    if (mimetype.includes("pdf"))
      return <FileText size={16} className="text-muted-foreground" />;
    if (mimetype.includes("javascript"))
      return <FileCode2 size={16} className="text-muted-foreground" />;
    return <FileText size={16} className="text-muted-foreground" />;
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

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (typeof onTaskMove === "function") {
      onTaskMove(draggableId, {
        source: { status: source.droppableId, index: source.index },
        destination: {
          status: destination.droppableId,
          index: destination.index,
        },
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto rounded-l">
        {Object.entries(columns).map(([status, columnTasks]) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="w-[300px] flex-shrink-0"
              >
                <Card className="bg-card rounded-2xl border border-border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-foreground px-2">
                      {columnTitles[status]}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-2">
                    <div className="flex flex-col gap-3 pb-2 min-h-[40vh]">
                      {columnTasks.length === 0 ? (
                        <p className="text-sm text-muted-foreground px-2">
                          No tasks
                        </p>
                      ) : (
                        columnTasks.map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(dragProvided, snapshot) => (
                              <Card
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps} // whole card is grabable
                                className={`bg-muted shadow-sm rounded-xl border transition cursor-grab active:cursor-grabbing ${
                                  snapshot.isDragging
                                    ? "border-accent shadow-lg"
                                    : "hover:border-accent hover:shadow-md"
                                }`}
                              >
                                <CardContent className="text-sm text-muted-foreground space-y-2 pt-2">
                                  <div className="flex items-start justify-between">
                                    <h1
                                      className="text-sm font-medium text-foreground hover:underline cursor-pointer"
                                      onClick={() =>
                                        handleNavigate(task.project, task._id)
                                      }
                                    >
                                      {task.title}
                                    </h1>
                                    <GripVertical
                                      size={16}
                                      className="text-muted-foreground opacity-60"
                                    />
                                  </div>

                                  {task.description && (
                                    <p className="line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}

                                  {task.labels?.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {task.labels.map((label, i) => (
                                        <Badge
                                          key={i}
                                          variant="secondary"
                                          className="px-2 py-0.5 rounded-md text-xs font-medium border bg-purple-100 text-purple-700 border-purple-200"
                                        >
                                          <Tag size={12} className="mr-1" />
                                          {label}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between gap-3">
                                    {task.priority && (
                                      <span
                                        className={`flex items-center gap-1.5 text-xs font-medium ${
                                          priorityConfig[task.priority]?.color
                                        }`}
                                      >
                                        {priorityConfig[task.priority]?.icon}
                                        {task.priority.charAt(0).toUpperCase() +
                                          task.priority.slice(1)}
                                      </span>
                                    )}

                                    {task.dueDate && (
                                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border bg-slate-50 text-slate-700 border-slate-200">
                                        <Calendar
                                          size={12}
                                          className="text-slate-500"
                                        />
                                        {formatDate(task.dueDate)}
                                      </span>
                                    )}
                                  </div>

                                  {task.assignedTo && (
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="text-xs">
                                        Assigned To :
                                      </span>
                                      <div className="flex items-center gap-1">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage
                                            src={task.assignedTo.avatarUrl}
                                          />
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
                                    </div>
                                  )}

                                  {task.attachments?.length > 0 && (
                                    <div className="space-y-1 pt-2">
                                      {task.attachments.map((file) => (
                                        <a
                                          key={file._id}
                                          href={file.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-2 text-xs text-muted-foreground hover:underline"
                                        >
                                          {getAttachmentIcon(file.mimetype)}
                                          <span className="truncate">
                                            {file?.url?.split("/").pop()}
                                          </span>
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanView;
