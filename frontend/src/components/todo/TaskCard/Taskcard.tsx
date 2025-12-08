'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  index: number;
  onTaskUpdated?: () => void;
  onTaskDeleted?: () => void;
}

export default function TaskCard({
  task,
  index,
  onTaskUpdated,
  onTaskDeleted,
}: TaskCardProps) {
  const [completed, setCompleted] = useState(task.completed);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem("user");
      setToken(userData ? JSON.parse(userData).token : null);
    }
  }, []);

  // ✅ Toggle task completion
  const toggleCompletion = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await axios.put<{ completed: boolean }>(
        `${apiUrl}/api/task/${task._id}`,
        { completed: !completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCompleted(response.data.completed);
      if (onTaskUpdated) onTaskUpdated();
    } catch (error: any) {
      console.error(
        "Update Task Error:",
        error.response?.data || error.message
      );
    }
  };

  // ✅ Update task title
  const updateTask = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axios.put(
        `${apiUrl}/api/task/${task._id}`,
        { title: editedTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsEditing(false);
      if (onTaskUpdated) onTaskUpdated();
    } catch (error: any) {
      console.error("Edit Task Error:", error.response?.data || error.message);
    }
  };

  // ✅ Delete task
  const deleteTask = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axios.delete(`${apiUrl}/api/task/${task._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (onTaskDeleted) onTaskDeleted();
    } catch (error: any) {
      console.error(
        "Delete Task Error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 transition-colors ${
      completed 
        ? "bg-green-50 border-green-200" 
        : "bg-white border-gray-200 hover:border-gray-300"
    }`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex-1">
          {index}.{" "}
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="mt-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
            />
          ) : (
            <span className={completed ? "line-through text-gray-500" : ""}>
              {task.title}
            </span>
          )}
        </h3>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={completed}
            onChange={toggleCompletion}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className={`text-sm font-medium ${
            completed ? "text-green-600" : "text-yellow-600"
          }`}>
            {completed ? "Completed ✅" : "Pending ⏳"}
          </span>
        </label>

        {isEditing ? (
          <>
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm font-medium" 
              onClick={updateTask}
            >
              💾 Save
            </button>
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors text-sm font-medium"
              onClick={() => setIsEditing(false)}
            >
              ❌ Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm font-medium"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit
            </button>
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm font-medium" 
              onClick={deleteTask}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

