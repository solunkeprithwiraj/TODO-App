import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", 
});

// Add Authorization token for protected routes
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token"); // Get token from local storage
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
