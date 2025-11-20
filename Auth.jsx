import React, { useState } from 'react';
import axios from 'axios';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const apiBase = "http://localhost:5001/api/auth";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const register = async () => {
    await axios.post(`${apiBase}/register`, {
      username: form.username,
      email: form.email,
      password: form.password,
    });
    setIsLogin(true);
    alert("Registered — login now");
  };

  const login = async () => {
    const res = await axios.post(`${apiBase}/login`, {
      email: form.email,
      password: form.password,
    });

    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) await login();
      else await register();
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-800 via-indigo-900 to-black p-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          {!isLogin && (
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full p-3 bg-white/10 placeholder-white/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 bg-white/10 placeholder-white/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 bg-white/10 placeholder-white/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center text-white/70">
          {isLogin ? "Don't have an account? " : "Already have account? "}
          <button
            className="text-indigo-300 underline ml-1"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
