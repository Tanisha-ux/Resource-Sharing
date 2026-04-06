// ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./ResetPassword.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      await API.post(`/api/reset-password/${token}`, { password });
      setMessage("Password reset successful!");
      navigate("/login");
    } catch (err) {
      setMessage("Token invalid or expired. Try again.");
    }
  };

  return (
    
    <div className="reset-password-container">
    <div className="reset-password-box">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && (
      <p className={message.includes("successful") ? "success" : "error"}>
        {message}
      </p>
    )}
      </div>
      
    </div>
  );
}

export default ResetPassword;