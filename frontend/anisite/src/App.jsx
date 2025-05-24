import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import './App.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { Outlet } from 'react-router-dom';
import useDynamicTitle from './hooks/useDynamicTitle.js';
import ScrollToTop from './utils/ScrollToTop.jsx';

function App() {
  useDynamicTitle("ANIVERSE");
  return (
    <AuthProvider>
      <ScrollToTop>
        <Navbar />
        <Outlet />
        <Footer />
      </ScrollToTop>
    </AuthProvider>
  )
}

export default App
