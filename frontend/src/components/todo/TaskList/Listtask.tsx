"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import TaskCard from "../TaskCard/Taskcard";
import { Task } from "@/types";

interface TasksResponse {
  tasks: Task[];
  totalPages: number;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [completed, setCompleted] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async (
    pageNumber: number = 1,
    searchQuery: string = "",
    completedStatus: string = ""
  ) => {
    try {
      const userData =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      const token = userData ? JSON.parse(userData).token : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await axios.get<TasksResponse>(
        `${apiUrl}/api/tasks?page=${pageNumber}&search=${searchQuery}&completed=${completedStatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTasks(response.data.tasks || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(pageNumber);
      setLoading(false);
    } catch (error: any) {
      console.error(
        "Fetch Tasks Error:",
        error.response?.data || error.message
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(1, search, completed);
  }, [search, completed]);

  // Handle search input
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    fetchTasks(1, e.target.value, completed);
  };

  // Handle filter change
  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCompleted(e.target.value);
    fetchTasks(1, search, e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="card-elevated animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">
              Your Tasks
            </h4>
            <p className="text-gray-600">Manage and organize your todo list</p>
          </div>
        </div>

        {/* Search Bar and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={handleSearch}
              className="input-field pl-12 focus:border-navy"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="sm:w-48 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </div>
            <select
              value={completed}
              onChange={handleFilterChange}
              className="input-field pl-10 appearance-none cursor-pointer focus:border-navy"
            >
              <option value="">All Tasks</option>
              <option value="true">Completed</option>
              <option value="false">Pending</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-medium">
                No tasks found
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Create your first task to get started!
              </p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index + 1}
                onTaskUpdated={() => fetchTasks(page, search, completed)}
                onTaskDeleted={() => fetchTasks(page, search, completed)}
              />
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {!loading && tasks.length > 0 && (
        <footer className="mt-6">
          <div className="flex justify-center items-center gap-4 card-elevated p-4">
            <button
              className="px-6 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium disabled:hover:bg-white border border-gray-200"
              disabled={page === 1}
              onClick={() => fetchTasks(page - 1, search, completed)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>
            <span className="text-gray-700 font-semibold px-4 py-2 bg-gray-50 rounded-lg">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-6 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium disabled:hover:bg-white border border-gray-200"
              disabled={page === totalPages}
              onClick={() => fetchTasks(page + 1, search, completed)}
            >
              Next
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
