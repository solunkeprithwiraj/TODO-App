"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Task } from "@/types";
import { TaskCreateDialog } from "./todo-create-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Edit2,
  GripVertical,
  RefreshCw,
} from "lucide-react";

interface KanbanColumn {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "completed";
  color: string;
  bgColor: string;
  borderColor: string;
}

const columns: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    status: "todo",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    id: "in-progress",
    title: "In Progress",
    status: "in-progress",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: "completed",
    title: "Completed",
    status: "completed",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
];

interface TasksResponse {
  tasks: Task[];
  totalPages: number;
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(
    null
  );
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [inProgressTasks, setInProgressTasks] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      setToken(userData ? JSON.parse(userData).token : null);

      // Load in-progress tasks from localStorage
      const savedInProgress = localStorage.getItem("kanban_in_progress");
      if (savedInProgress) {
        try {
          setInProgressTasks(new Set(JSON.parse(savedInProgress)));
        } catch (e) {
          console.error("Error loading in-progress tasks:", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery]);

  // Save in-progress tasks to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && inProgressTasks.size > 0) {
      localStorage.setItem(
        "kanban_in_progress",
        JSON.stringify(Array.from(inProgressTasks))
      );
    }
  }, [inProgressTasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await axios.get<TasksResponse>(
        `${apiUrl}/api/tasks?page=1&search=&completed=`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setTasks(response.data.tasks || []);
    } catch (error: any) {
      console.error(
        "Fetch Tasks Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    if (!searchQuery.trim()) {
      setFilteredTasks(tasks);
      return;
    }
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  const getTasksByStatus = (status: string): Task[] => {
    return filteredTasks.filter((task) => {
      if (status === "completed") return task.completed;
      if (status === "in-progress")
        return !task.completed && inProgressTasks.has(task._id);
      if (status === "todo")
        return !task.completed && !inProgressTasks.has(task._id);
      return false;
    });
  };

  const updateTaskStatus = async (
    taskId: string,
    newStatus: "todo" | "in-progress" | "completed"
  ) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const completed = newStatus === "completed";

      // Update in-progress tracking
      if (newStatus === "in-progress") {
        setInProgressTasks((prev) => new Set([...prev, taskId]));
      } else if (newStatus === "todo") {
        setInProgressTasks((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
      } else if (newStatus === "completed") {
        // Remove from in-progress when completed
        setInProgressTasks((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
      }

      // Only update API if status changed to/from completed
      if (completed !== tasks.find((t) => t._id === taskId)?.completed) {
        await axios.put(
          `${apiUrl}/api/task/${taskId}`,
          { completed },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Optimistic update
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, completed } : task
        )
      );
    } catch (error: any) {
      console.error(
        "Update Task Error:",
        error.response?.data || error.message
      );
      // Revert on error
      fetchTasks();
    }
  };

  const updateTaskTitle = async (taskId: string) => {
    if (!editTitle.trim()) {
      setEditingTask(null);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axios.put(
        `${apiUrl}/api/task/${taskId}`,
        { title: editTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, title: editTitle } : task
        )
      );
      setEditingTask(null);
      setEditTitle("");
    } catch (error: any) {
      console.error(
        "Update Task Error:",
        error.response?.data || error.message
      );
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axios.delete(`${apiUrl}/api/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Remove from tasks and in-progress tracking
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setInProgressTasks((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    } catch (error: any) {
      console.error(
        "Delete Task Error:",
        error.response?.data || error.message
      );
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", task._id);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDraggedOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDraggedOverColumn(null);

    if (draggedTask) {
      const column = columns.find((col) => col.id === columnId);
      if (column) {
        const currentStatus = draggedTask.completed
          ? "completed"
          : inProgressTasks.has(draggedTask._id)
          ? "in-progress"
          : "todo";

        // Only update if status actually changed
        if (currentStatus !== column.status) {
          updateTaskStatus(draggedTask._id, column.status);
        }
      }
    }

    setDraggedTask(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  const getTaskCount = (status: string) => {
    return getTasksByStatus(status).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Kanban Board
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Organize and manage your tasks visually
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={fetchTasks}
              className="flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <TaskCreateDialog onTaskCreated={fetchTasks} />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading tasks...</p>
            </div>
          </div>
        ) : (
          /* Kanban Columns */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {columns.map((column) => {
              const columnTasks = getTasksByStatus(column.status);
              const isDraggedOver = draggedOverColumn === column.id;

              return (
                <div
                  key={column.id}
                  className={`flex flex-col h-full min-h-[600px] rounded-xl border-2 transition-all duration-200 ${
                    isDraggedOver
                      ? `${column.borderColor} ${column.bgColor} shadow-lg scale-[1.02]`
                      : "border-gray-200 bg-white/80 backdrop-blur-sm"
                  }`}
                  onDragOver={(e) => handleDragOver(e, column.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  {/* Column Header */}
                  <div
                    className={`p-4 rounded-t-xl ${column.bgColor} border-b-2 ${column.borderColor}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {column.status === "todo" && (
                          <Circle className={`w-5 h-5 ${column.color}`} />
                        )}
                        {column.status === "in-progress" && (
                          <Clock className={`w-5 h-5 ${column.color}`} />
                        )}
                        {column.status === "completed" && (
                          <CheckCircle2 className={`w-5 h-5 ${column.color}`} />
                        )}
                        <h2 className={`text-lg font-bold ${column.color}`}>
                          {column.title}
                        </h2>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${column.bgColor} ${column.color} border ${column.borderColor}`}
                      >
                        {getTaskCount(column.status)}
                      </span>
                    </div>
                  </div>

                  {/* Tasks Container */}
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                    {columnTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                          {column.status === "todo" && (
                            <Circle className="w-6 h-6" />
                          )}
                          {column.status === "in-progress" && (
                            <Clock className="w-6 h-6" />
                          )}
                          {column.status === "completed" && (
                            <CheckCircle2 className="w-6 h-6" />
                          )}
                        </div>
                        <p className="text-sm font-medium">No tasks</p>
                      </div>
                    ) : (
                      columnTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onDragStart={handleDragStart}
                          onEdit={(task) => {
                            setEditingTask(task._id);
                            setEditTitle(task.title);
                          }}
                          onDelete={deleteTask}
                          onUpdate={updateTaskTitle}
                          editingTask={editingTask}
                          editTitle={editTitle}
                          setEditTitle={setEditTitle}
                          formatDate={formatDate}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Get started by creating your first task. Click the button above to
              add a new task to your kanban board.
            </p>
            <TaskCreateDialog />
          </div>
        )}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string) => void;
  editingTask: string | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  formatDate: (date?: string) => string;
}

function TaskCard({
  task,
  onDragStart,
  onEdit,
  onDelete,
  onUpdate,
  editingTask,
  editTitle,
  setEditTitle,
  formatDate,
}: TaskCardProps) {
  const isEditing = editingTask === task._id;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className="group relative bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-move hover:border-blue-300"
    >
      {/* Drag Handle */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Task Content */}
      <div className="pr-6">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full py-1.5 text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onUpdate(task._id);
                }
                if (e.key === "Escape") {
                  setEditTitle(task.title);
                  onEdit({ ...task, _id: "" }); // Reset editing
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onUpdate(task._id)}
                className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditTitle(task.title);
                  onEdit({ ...task, _id: "" });
                }}
                className="h-7 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-snug">
              {task.title}
            </h3>

            {/* Task Meta */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              {task.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.createdAt)}</span>
                </div>
              )}
            </div>

            {/* Task Actions */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600 hover:text-blue-600"
                title="Edit task"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600 hover:text-red-600"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
