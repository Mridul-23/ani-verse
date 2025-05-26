import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null); 

  try {
    await axiosInstance.post('auth/register/', { username, password });
    navigate('../login');
  } catch (err) {
    console.error('Registration Error:', err);

    if (err.response) {
      const status = err.response.status;
      const data = err.response.data;

      if (status === 400) {
        // Show detailed validation or duplication errors
        if (data.username) {
          setError(`Username: ${data.username.join(', ')}`);
        } else if (data.password) {
          setError(`Password: ${data.password.join(', ')}`);
        } else if (data.detail) {
          setError(data.detail);
        } else if (typeof data === 'string') {
          setError(data);
        } else {
          setError('Invalid input. Please check your data.');
        }
      } else {
        setError(`Unexpected error (${status}). Please try again.`);
      }
    } else {
      setError('Server unreachable. Please try again later.');
    }
  }
};


  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-3xl text-center font-semibold uppercase text-white mb-6">Signup</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
          Signup
        </button>
        <p className="text-gray-300 mt-4">
          Already have an account?{' '}
          <span 
            className="text-blue-400 cursor-pointer" 
            onClick={() => navigate('../login')}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
