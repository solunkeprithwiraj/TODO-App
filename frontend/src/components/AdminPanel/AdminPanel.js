import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Adminpanel.css";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [minTasks, setMinTasks] = useState(0); 
const [loading, setLoading] = useState(true);
  const userData = localStorage.getItem("user");
  const token = userData ? JSON.parse(userData).token : null;
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchAllUsers(1);
    }
  }, [token]);

 const fetchAllUsers = async (
   pageNumber,
   minTasks = 0,
   searchQuery = "",
   sortOrder = "desc"
 ) => {
   setUsers([]); 
   setFilteredUsers([]); 
   setLoading(true);

   try {
     const response = await axios.get(
       `http://localhost:5000/api/admin/users?page=${pageNumber}&limit=5&minTasks=${minTasks}&search=${searchQuery}&sort=${sortOrder}`,
       { headers: { Authorization: `Bearer ${token}` } }
     );

     setUsers(response.data.users || []);
     setFilteredUsers(response.data.users || []);
     setUserTotalPages(response.data.totalPages);
     setUserPage(pageNumber);
   } catch (error) {
     console.error("Error fetching users:", error);
   } finally {
     setLoading(false);
   }
 };


 
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchAllUsers(1, minTasks, query);
  };

  
  const handleFilterChange = (e) => {
    const minTaskCount = parseInt(e.target.value, 10);
    setMinTasks(minTaskCount);
    fetchAllUsers(1, minTaskCount, searchQuery);
  };

  const viewUserTasks = (userId) => {
    navigate(`/admin/user/${userId}/tasks`);
  };

  return (
    <div className="admin-panel-container">
      <h1>Admin Panel</h1>
      <h2>All Users</h2>

      
      <div className="filter-container">
        <div className="div1">
          <input
            type="text"
            placeholder="Search user by name..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="div2">
          <select value={minTasks} onChange={handleFilterChange}>
            <option value="0">All Users</option>
            <option value="10">Min 10 Tasks</option>
            <option value="20">Min 20 Tasks</option>
            <option value="30">Min 30 Tasks</option>
          </select>
        </div>
      </div>

      
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Tasks Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr
                key={`${user._id}-${userPage}`}
                className="user-row"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <td>{user.name}</td>
                <td>{user.taskCount}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => viewUserTasks(user._id)}
                  >
                    View Tasks
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      
      <div className="pagination">
        <button
          disabled={userPage === 1}
          onClick={() => fetchAllUsers(userPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {userPage} of {userTotalPages}
        </span>
        <button
          disabled={userPage === userTotalPages}
          onClick={() => fetchAllUsers(userPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
