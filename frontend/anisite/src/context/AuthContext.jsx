import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('access');
    const refreshToken = localStorage.getItem('refresh');

    if (accessToken && refreshToken) {
      axiosInstance
        .get('/user/profile/')
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          setUser(null);
          navigate('/auth/login');
        });
    }
    setLoading(false);
  }, [navigate]);

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post('auth/login/', { username, password });
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      setUser({ username });
      navigate('/profile');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
    navigate('/auth/login');
  
    try {
      await axiosInstance.delete('/recommendations/initialize/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
      });
      console.log('User recommendation session deleted.');
    } catch (error) {
      console.warn('Failed to delete recommendation session. Probably due to an expired token.');
    }
  };
  
  

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
