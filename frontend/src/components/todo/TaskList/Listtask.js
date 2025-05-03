import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../TaskCard/Taskcard";
import "./Tasklist.css";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(""); // Search query state
  const [completed, setCompleted] = useState(""); // Filter state for task completion status
  const [loading, setLoading] = useState(true); // Loading state

  const fetchTasks = async (
    pageNumber = 1,
    searchQuery = "",
    completedStatus = ""
  ) => {
    try {
      const userData = localStorage.getItem("user");
      const token = userData ? JSON.parse(userData).token : null;
      const response = await axios.get(
        `http://localhost:5000/api/tasks?page=${pageNumber}&search=${searchQuery}&completed=${completedStatus}`,
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
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error(
        "Fetch Tasks Error:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchTasks(1, search, completed); // Fetch tasks when search or filter changes
  }, [search, completed]);

  // Handle search input
  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchTasks(1, e.target.value, completed); // Fetch tasks with new search query
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setCompleted(e.target.value);
    fetchTasks(1, search, e.target.value); // Fetch tasks with new filter value
  };

  return (
    <>
      <div className="task-list">
        <h4>Your Tasks</h4>

        {/* Search Bar */}
        <div className="filter-container">
          <div className="div1">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={handleSearch} // Update search state on change
              className="search-bar"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="div2">
            <select
              value={completed}
              onChange={handleFilterChange} // Update filter state on change
              className="filter-dropdown"
            >
              <option value="">All</option>
              <option value="true">Completed</option>
              <option value="false">Pending</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        <div className="lists">
          {loading ? (
            <p>Loading tasks...</p> // Show loading message
          ) : tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index + 1}
                onTaskUpdated={fetchTasks}
                onTaskDeleted={fetchTasks}
              />
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <footer>
        <div className="pagination">
          <button
            className="navigation-btn"
            disabled={page === 1}
            onClick={() => fetchTasks(page - 1, search, completed)} // Fetch tasks for previous page
          >
            <img src="/back.png" alt="" style={{ width: "15px" }} />
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => fetchTasks(page + 1, search, completed)} // Fetch tasks for next page
          >
            <img src="/next.png" alt="" style={{ width: "15px" }} />
          </button>
        </div>
      </footer>
    </>
  );
}
