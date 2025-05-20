import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Viewer' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
   <div className="min-h-screen bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-400 flex items-center justify-center p-6">
  <form
    onSubmit={handleSubmit}
    className="p-8 max-w-md w-full bg-white bg-opacity-90 rounded-xl shadow-2xl"
  >
    <h2 className="text-3xl font-extrabold mb-6 text-purple-700 text-center">
      Register
    </h2>

    {error && (
      <p className="text-red-700 bg-red-200 rounded px-4 py-2 mb-4 text-center font-semibold shadow-md">
        {error}
      </p>
    )}

    <input
      name="name"
      value={form.name}
      onChange={handleChange}
      placeholder="Name"
      required
      className="block w-full mb-5 p-3 rounded-lg border border-purple-300 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />

    <input
      name="email"
      type="email"
      value={form.email}
      onChange={handleChange}
      placeholder="Email"
      required
      className="block w-full mb-5 p-3 rounded-lg border border-purple-300 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
    />

    <input
      name="password"
      type="password"
      value={form.password}
      onChange={handleChange}
      placeholder="Password"
      required
      className="block w-full mb-5 p-3 rounded-lg border border-purple-300 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
    />

    <select
      name="role"
      value={form.role}
      onChange={handleChange}
      className="block w-full mb-6 p-3 rounded-lg border border-purple-300 text-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
    >
      <option value="Admin">Admin</option>
      <option value="Editor">Editor</option>
      <option value="Viewer">Viewer</option>
    </select>

    <button
      type="submit"
      className="w-full py-3 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 transition"
    >
      Register
    </button>

    <p className="text-sm mt-5 text-center text-purple-700">
      Already have an account?{' '}
      <Link to="/login" className="font-semibold underline hover:text-purple-900">
        Login
      </Link>
    </p>
  </form>
</div>
  );
};

export default Register;