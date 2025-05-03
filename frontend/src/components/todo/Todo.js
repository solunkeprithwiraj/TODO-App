import axios from "axios";
import React, { useState } from "react";
import "./Todo.css";

export default function Todo({ onTaskAdded }) {
  const [task, setTask] = useState("");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const createTask = async (e) => {
    e.preventDefault();
    if (!task.trim()) return; 

    try {
      const userData = localStorage.getItem("user");
      const token = userData ? JSON.parse(userData).token : null; // Retrieve token
      const formattedTask = task.charAt(0).toUpperCase() + task.slice(1).toLowerCase();
      const userTask = { title: formattedTask, completed: false }; // Correct structure

      const response = await axios.post(
        "http://localhost:5000/api/tasks", 
        userTask,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Task Added:", response.data);

      if (onTaskAdded) onTaskAdded(); 
      setTask(""); 
      
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  return (
    <div className="box">
      <h1>Hello {user ? user.name : "Guest"}</h1>
      <form onSubmit={createTask}>
        <input
          className="my-2 pd-2 text"
          type="text"
          placeholder="Enter Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="button btn btn-primary" type="submit">Add Task</button>
      </form>
    </div>
  );
}
