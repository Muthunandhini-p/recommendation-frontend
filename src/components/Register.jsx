import React, { useState } from "react";
import api from "../services/api";

const Register = ({ onSwitch }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/auth/register", {
        username: username.trim(),
        password: password.trim(),
      });

      setMessage(res.data);
      setUsername("");
      setPassword("");
    } catch (error) {
      const msg =
        error.response?.data || "Registration failed. Try again.";
      setMessage(msg);
    }
  };

  return (
    <div>
      <h2>Register</h2>

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

        <button type="submit">Register</button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Already have an account?{" "}
        <button onClick={onSwitch}>Login here</button>
      </p>
    </div>
  );
};

export default Register;
