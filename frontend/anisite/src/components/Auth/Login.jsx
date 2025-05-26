import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');


    try {
      await login(username, password);
      navigate('/profile');
    } catch (error) {
    console.error('Login failed:', error);

    if (error.response) {
      if (error.response.status === 401) {
        setErrorMsg('Invalid username or password.');
      } else {
        setErrorMsg(`Error: ${error.response.status} - ${error.response.statusText}`);
      }
    } else {
      setErrorMsg('Server unreachable. Please try again later.');
    }
  }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl text-center text-white mb-4">Login</h2>
        <div className="mb-4">
          <label className="block mb-2 text-gray-300" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-4 relative">
          <label className="block mb-2 text-gray-300" htmlFor="password">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded pr-10"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute transform translate-y-3 -translate-x-6 cursor-pointer text-gray-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Login
        </button>
        {errorMsg && (
          <p className="text-red-500 text-sm mt-3 text-center">{errorMsg}</p>
        )}
        <p className="text-gray-300 text-sm mt-4">
          Don't have an account?{' '}
          <span 
            className="text-blue-400 cursor-pointer" 
            onClick={() => navigate('../register')}
          >
            Create one
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
