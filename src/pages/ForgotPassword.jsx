import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); // success or error message

  const handleSubmit = async (e) => {
    e.preventDefault();
  try {
    // send email to backend
    await API.post("/api/forgot-password", { email });

    // show generic message regardless of backend response
    setMessage(
      "If this email is registered, a password reset link has been sent."
    );
    setEmail(""); // clear the input
  } catch (err) {
    console.log(err.response?.data);
    setMessage(
      "If this email is registered, a password reset link has been sent."
    );
  }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>

        {message && <p className="message">{message}</p>}

        <p>
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;