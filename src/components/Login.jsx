import React, { useState } from "react";
import { loginUser } from "../api/user";
import '../Login.css';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(email, password, role); // send role to backend
      localStorage.setItem("token", data.token);
      
      onLoginSuccess(data.user);
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box-wrapper">
        {/* Left Panel */}
        <div className="login-left-panel">
          <img
            src="https://cdn.shopify.com/s/files/1/0558/6413/1764/files/Code_Logo_Design_19_1024x1024.webp?v=1747324503"
            alt="Code Visual"
            className="login-image"
          />
          <h2 className="login-quote">This is a software powered world!</h2>
        </div>

        {/* Right Panel */}
        <div className="login-right-panel">
          <h2 className="login-title">Welcome!</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />

            <div className="forgot-password">
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" className="login-button">Login</button>
            {error && <p className="login-error">{error}</p>}
          </form>

          {/* Role Selector */}
          <div className="role-buttons">
            <button
              type="button"
              className={`role-btn student-btn ${role === "student" ? "active-role" : ""}`}
              onClick={() => setRole("student")}
            >
              Student
            </button>
            <button
              type="button"
              className={`role-btn faculty-btn ${role === "teacher" ? "active-role" : ""}`}
              onClick={() => setRole("teacher")}
            >
              Faculty
            </button>
            <button
              type="button"
              className={`role-btn admin-btn ${role === "admin" ? "active-role" : ""}`}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
