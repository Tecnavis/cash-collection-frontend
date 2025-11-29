import React, { useState } from "react";
import Cookies from "js-cookie";
import api, { BASE_URL } from "../../api";

const LoginContent2 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // IMPORTANT: this URL + payload matches the Django backend
      const response = await api.post("/users/login/", {
        email,        // backend expects "email"
        password,     // and "password"
      });

      const data = response.data;

      // Save tokens from backend into cookies (names must match api.js)
      Cookies.set("access_token", data.access_token, {
        expires: 1,
        secure: window.location.protocol === "https:",
        sameSite: "Strict",
      });

      Cookies.set("refresh_token", data.refresh_token, {
        expires: 7,
        secure: window.location.protocol === "https:",
        sameSite: "Strict",
      });

      // Redirect after successful login
      window.location.href = "/"; // or "/dashboard" if that's your home page
    } catch (err) {
      console.error("Login error:", err);

      // Try to show backend error if available
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.detail) {
          setError(data.detail);
        } else if (typeof data === "string") {
          setError(data);
        } else {
          setError("Invalid email or password.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-form">
        {/* Your existing layout / styles can stay the same – just keep the inputs wired to state */}

        <div className="form-group">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: "8px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginContent2;
