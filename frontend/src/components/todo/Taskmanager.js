import React, { useState } from "react";
import Todo from "./Todo";
import TaskList from "./TaskList/Listtask";

export default function TaskManager() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <Todo onTaskAdded={() => setRefresh(!refresh)} />
      <TaskList key={refresh} />
    </div>
  );
}
