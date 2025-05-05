import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

import axios from "axios";
export default function Login() {
  
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setServerError("");

    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else if (password.length > 15) {
      setPasswordError("Password must be less than 15 characters");
      isValid = false;
    }

    if (isValid) {
      try {
        const userData = { email, password };


        const response = await axios.post(
          "http://localhost:5000/api/user/login", 
          userData
        );

        console.log("Login Successful:", response.data);

        // Store only necessary user details (excluding password)
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            token: response.data.user.token,
            isAdmin: response.data.user.isAdmin
          })
        );

        setEmail("");
        setPassword("");
        console.log(response.data.message);
        navigate("/");
      } catch (error) {
        console.log("Login Error:", error.response?.data, error);
        if (error.response) {
          setServerError(error.response.data.error || "Login failed");
        } else {
          setServerError("Server is unreachable");
        }
        console.log(error.response?.data?.error || "An error occurred");
      }
    }
  };

  return (
    <>
      <section className="vh-100" style={{ backgroundColor: "#eee" }}>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                        Log in
                      </p>

                      <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                          <div
                            data-mdb-input-init
                            className="form-outline flex-fill mb-0"
                          >
                            <input
                              type="email"
                              id="form3Example3c"
                              className="form-control"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                            <label
                              className="form-label"
                              htmlFor="form3Example3c"
                            >
                              Your Email
                            </label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                          <div
                            data-mdb-input-init
                            className="form-outline flex-fill mb-0"
                          >
                            <input
                              type="password"
                              id="form3Example4c"
                              className="form-control"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <label
                              className="form-label"
                              htmlFor="form3Example4c"
                            >
                              Password
                            </label>
                          </div>
                        </div>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <input
                            className="btn btn-primary btn-lg"
                            type="submit"
                            value="LogIn"
                          />
                        </div>
                        <div id="register-link" className="text-right">
                          <div>Not a user? </div>
                          <Link to="/signup" className="text-info">
                            Register  test
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
