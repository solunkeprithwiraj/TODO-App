'use client'

import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Task } from "@/types";

interface UserTasksProps {
  userId: string;
}

interface TasksResponse {
  tasks: Task[];
  totalPages: number;
}

export default function UserTasks({ userId }: UserTasksProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem("user");
      setToken(userData ? JSON.parse(userData).token : null);
    }
  }, []);

  useEffect(() => {
    if (userId && token) {
      fetchUserTasks(page);
    }
  }, [userId, searchTerm, filter, page, token]);

  const fetchUserTasks = async (pageNumber: number = 1) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await axios.get<TasksResponse>(
        `${apiUrl}/api/admin/user/${userId}/tasks?page=${pageNumber}&limit=10&search=${searchTerm}&status=${filter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(response.data.tasks || []);
      setTotalPages(response.data.totalPages);
      setFilteredTasks(response.data.tasks || []);
      setPage(pageNumber);
    } catch (error: any) {
      console.error("Error fetching user tasks:", error);
      setTasks([]);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task._id);
    setNewTitle(task.title);
  };

  const saveEdit = async (taskId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axios.patch(
        `${apiUrl}/api/admin/tasks/${taskId}`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, title: newTitle } : task
        )
      );
      setEditingTaskId(null);
    } catch (error: any) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axios.delete(`${apiUrl}/api/admin/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setFilteredTasks((prevFilteredTasks) =>
        prevFilteredTasks.filter((task) => task._id !== taskId)
      );
    } catch (error: any) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <button 
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          onClick={() => router.back()}
        >
          🔙 Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Tasks</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select 
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value)} 
              value={filter}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">All</option>
              <option value="completed">Completed</option>
              <option value="notCompleted">Not Completed</option>
            </select>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search task..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingTaskId === task._id ? (
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{task.title}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.completed ? "✅ Completed" : "❌ Not Completed"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {editingTaskId === task._id ? (
                          <button
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
                            onClick={() => saveEdit(task._id)}
                          >
                            💾 Save
                          </button>
                        ) : (
                          <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            onClick={() => startEditing(task)}
                          >
                            Edit
                          </button>
                        )}
                        <button
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                          onClick={() => deleteTask(task._id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-center items-center gap-4">
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={page === 1} 
            onClick={() => fetchUserTasks(page - 1)}
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={page === totalPages}
            onClick={() => fetchUserTasks(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

