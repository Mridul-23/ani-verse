import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import './App.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { Outlet } from 'react-router-dom';
import useDynamicTitle from './hooks/useDynamicTitle.js';

function App() {
  useDynamicTitle("ANIVERSE");
  return (
    <AuthProvider>
      <Navbar />
      <Outlet />
      <Footer />
    </AuthProvider>
  )
}

export default App
