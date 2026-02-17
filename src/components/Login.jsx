import React, { useState } from "react";
import api from "../services/api";

const Login = ({ onLogin, onSwitch }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/api/auth/login", {
        username: username.trim(),
        password: password.trim(),
      });

      onLogin(username.trim());
    } catch (err) {
      console.error("Login error:", err);

      let message = "Login failed";

      if (err.response && err.response.data) {
        if (typeof err.response.data === "string") {
          message = err.response.data;
        } else if (err.response.data.error) {
          message = err.response.data.error;
        } else {
          message = "Invalid username or password";
        }
      }

      setError(message);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Don’t have an account?{" "}
        <button onClick={onSwitch}>Register here</button>
      </p>
    </div>
  );
};

export default Login;
