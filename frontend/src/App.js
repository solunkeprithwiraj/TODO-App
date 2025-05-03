import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/Home/Home";
import "./App.css"
import Signup from "./components/user/signup/Signup";
import Login from "./components/user/login/Login";
import TaskManager from "./components/todo/Taskmanager";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import UserTasks from "./components/AdminPanel/uaserTasks";

const App = () => {
  return (
    <>
      <Router>
        <Navbar className="navbar" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todo" element={<TaskManager />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/user/:userId/tasks" element={<UserTasks />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
