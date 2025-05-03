import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Adminpanel.css";
import "./userTaasks.css";

export default function UserTasks() {
  const { userId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const userData = localStorage.getItem("user");
  const token = userData ? JSON.parse(userData).token : null;
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchUserTasks(page);
    }
  }, [userId, searchTerm, filter, page]);

  const fetchUserTasks = async (pageNumber = 1) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/user/${userId}/tasks?page=${pageNumber}&limit=10&search=${searchTerm}&status=${filter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(response.data.tasks || []);
      setTotalPages(response.data.totalPages);
      setFilteredTasks(response.data.tasks || []);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching user tasks:", error);
      setTasks([]);
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setNewTitle(task.title);
  };

  const saveEdit = async (taskId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/tasks/${taskId}`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, title: newTitle } : task
        )
      );
      setEditingTaskId(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted task from both tasks and filteredTasks state
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setFilteredTasks((prevFilteredTasks) =>
        prevFilteredTasks.filter((task) => task._id !== taskId)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="admin-panel">
      <button className="btn btn-success" onClick={() => navigate(-1)}>
        🔙 Back
      </button>
      <h2>User Tasks</h2>
      <div className="filter-container">
        <label>Filter: </label>
        <div className="div1">
          <select onChange={(e) => setFilter(e.target.value)} value={filter}>
            <option value="">All</option>
            <option value="completed">Completed</option>
            <option value="notCompleted">Not Completed</option>
          </select>
        </div>
        <div className="div2">
          <input
            type="text"
            placeholder="Search task..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Completed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <tr key={task._id}>
                <td className="titles">
                  {editingTaskId === task._id ? (
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  ) : (
                    task.title
                  )}
                </td>
                <td>{task.completed ? "✅ Completed" : "❌ Not Completed"}</td>
                <td className="button-edit-delete">
                  {editingTaskId === task._id ? (
                    <button
                      className="btn btn-warning"
                      onClick={() => saveEdit(task._id)}
                    >
                      💾 Save
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => startEditing(task)}
                    >
                      {" "}
                      Edit
                    </button>
                  )}

                  <button
                    className="btn btn-danger"
                    onClick={() => deleteTask(task._id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No tasks found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button disabled={page === 1} onClick={() => fetchUserTasks(page - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => fetchUserTasks(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
