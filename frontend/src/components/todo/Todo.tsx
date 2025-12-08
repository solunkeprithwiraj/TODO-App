"use client";

import axios from "axios";
import React, { useState, useEffect, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";

interface TodoProps {
  onTaskAdded?: () => void;
}

export default function Todo({ onTaskAdded }: TodoProps) {
  const [task, setTask] = useState("");
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const createTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task.trim()) return;

    try {
      const userData =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      const token = userData ? JSON.parse(userData).token : null;
      const formattedTask =
        task.charAt(0).toUpperCase() + task.slice(1).toLowerCase();
      const userTask = { title: formattedTask, completed: false };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await axios.post(`${apiUrl}/api/tasks`, userTask, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Task Added:", response.data);

      if (onTaskAdded) onTaskAdded();
      setTask("");
    } catch (error: any) {
      console.error(
        "Error:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card-elevated animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-navy flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {user?.name?.charAt(0).toUpperCase() || "G"}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hello, {user?.name || "Guest"}!
            </h1>
            <p className="text-gray-600 text-sm">Let's get things done today</p>
          </div>
        </div>

        <form onSubmit={createTask} className="flex flex-col sm:flex-row gap-3">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <input
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-base"
              type="text"
              placeholder="What needs to be done?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
          </div>
          <button
            className="btn-primary px-8 py-4 whitespace-nowrap flex items-center gap-2"
            type="submit"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}
