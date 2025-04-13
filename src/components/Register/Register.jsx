import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  // State to handle form input values
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: ""
  });
  const [avatar, setAvatar] = useState(null);

  // State for error and success messages
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate(); // Hook for navigation

  // Handles input changes and updates form state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  // Handles form submission
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent page refresh

    const form = new FormData();
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("password", formData.password);
    if (avatar) {
      form.append("avatar", avatar); // Append file to FormData
    }

    try {
      const res = await fetch("https://youtube-backend-wjcl.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Send form data to server
      });

      const data = await res.json();

      // If registration fails, show error message
      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      // If registration is successful, show success and redirect
      setSuccessMessage("Registration successful! Redirecting...");
      setError("");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Something went wrong. Please try again."); // Catch network/server errors
    }
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        {/* Username input */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          onChange={handleChange}
          autoComplete="username"
        />

        {/* Email input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          autoComplete="email"
        />

        {/* Password input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          autoComplete="new-password"
        />


        <label htmlFor="avatar" className="avatar-label">Profile</label>

        {/* Optional avatar URL input */}
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Display error or success messages */}
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}

        {/* Submit button */}
        <button type="submit">Register</button>
      </form>

      {/* Link to login page */}
      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default Register;
