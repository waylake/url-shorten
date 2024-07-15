import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { loginUser } from "../api/authApi";
import { AppDispatch } from "../store/store"; // AppDispatch 타입을 import

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>(); // AppDispatch 타입을 사용
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await loginUser(email, password);
      await dispatch(login({ email, password })); // login 액션에 { email, password }를 전달
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className="max-w-md mx-auto text-gray-800 dark:text-gray-200">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded dark:text-gray-800 text-gray-200"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded dark:text-gray-800 text-gray-200"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
