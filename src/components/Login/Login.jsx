import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ".//Login.css"; // Import login styles

const Login = () => {
  // State to hold email and password input
  const [formData, setFormData] = useState({ email: "", password: "" });

  // State to store error messages
  const [error, setError] = useState("");

  // Hook for navigation after login
  const navigate = useNavigate();

  // Update form data state when user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from reloading page

    try {
      // Send login request to backend
      const res = await fetch("https://youtube-backend-wjcl.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // If response is not OK, throw an error
      if (!res.ok) throw new Error(data.message);

      // Store user info and token in local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      // Navigate to home and refresh the page
      navigate("/");
      window.location.reload();
    } catch (err) {
      // Set error message to show to user
      setError(err.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>

      {/* Login form */}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          autoComplete="password"
        />

        {/* Display error message if login fails */}
        {error && <p className="error">{error}</p>}

        <button type="submit">Sign in</button>
      </form>

      {/* Link to registration page */}
      <p>
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
};

export default Login;
