"use client";

import React, { useState } from "react";
import Todo from "./Todo";
import TaskList from "./TaskList/Listtask";

export default function TaskManager() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Todo onTaskAdded={() => setRefresh(!refresh)} />
      <TaskList key={refresh.toString()} />
    </div>
  );
}
