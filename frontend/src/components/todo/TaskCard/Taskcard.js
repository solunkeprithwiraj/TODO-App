import React, { useState } from "react";
import axios from "axios";
import "./TaskCard.css";

export default function TaskCard({
  task,
  index,
  onTaskUpdated,
  onTaskDeleted,
}) {
  const [completed, setCompleted] = useState(task.completed);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const userData = localStorage.getItem("user");
  const token = userData ? JSON.parse(userData).token : null;

  // ✅ Toggle task completion
  const toggleCompletion = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/task/${task._id}`,
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
    } catch (error) {
      console.error(
        "Update Task Error:",
        error.response?.data || error.message
      );
    }
  };

  // ✅ Update task title
  const updateTask = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/task/${task._id}`,
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
    } catch (error) {
      console.error("Edit Task Error:", error.response?.data || error.message);
    }
  };

  // ✅ Delete task
  const deleteTask = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/task/${task._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (onTaskDeleted) onTaskDeleted();
    } catch (error) {
      console.error(
        "Delete Task Error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className={completed ? "task-card completed-task" : "task-card"}>
      <h3>
        {index}.{" "}
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
        ) : (
          task.title
        )}
      </h3>

      <div className="task-actions">
        <input
          type="checkbox"
          checked={completed}
          onChange={toggleCompletion}
        />
        <span>{completed ? "Completed ✅" : "Pending ⏳"}</span>

        {isEditing ? (
          <>
            <button className="save-btn btn btn-success" onClick={updateTask}>
              💾 Save
            </button>
            <button
              className="cancel-btn btn btn-warning"
              onClick={() => setIsEditing(false)}
            >
              ❌ Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="edit-btn btn btn-secondary"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit
            </button>
            <button className="delete-btn btn btn-danger" onClick={deleteTask}>
              Delete
            </button>
          </>
        )}

        {/* <button className="delete-btn btn btn-danger" onClick={deleteTask}>
          Delete
        </button> */}
      </div>
    </div>
  );
}
