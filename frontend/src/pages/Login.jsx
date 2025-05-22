import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", form);
    
    // Save token to localStorage
    localStorage.setItem("token", res.data.token);
    
    // If you also want to save user info, you can do so
    localStorage.setItem("user", JSON.stringify(res.data.user));
    
    // Then do any state updates or navigation
    login(res.data); // if this updates React state or context
    
    navigate("/dashboard");
  } catch (err) {
    setError(err.response?.data?.msg || "Login failed");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl px-8 py-10 text-center"
      >
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">
          Welcome Back 👋
        </h2>
        {error && (
          <p className="text-red-500 mb-4 text-sm font-medium">{error}</p>
        )}

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
        />

        <button
          type="submit"
          className="w-full py-3 text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-purple-500 rounded-lg text-sm font-semibold shadow-md transition duration-300"
        >
          🚀 Login to ZidioTaskManager
        </button>

        <p className="text-sm text-gray-700 mt-5">
          Don't have an account?
          <Link
            to="/register"
            className="text-pink-600 font-semibold hover:underline ml-1"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
