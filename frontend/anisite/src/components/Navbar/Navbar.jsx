import React, { useState, useEffect } from 'react';
import { LuInfo } from "react-icons/lu";
import { IoMenu } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";
import { Link, Links, NavLink, useLocation } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { BiHomeAlt2 } from "react-icons/bi";
import MenuDrawer from './MenuDrawer';
import useAuth from '../../hooks/useAuth';
import SearchBar from './SearchBar';

const Navbar = () => {
  const [menuOn, setMenuOn] = useState(false);
  const [pathHome, setPathHome] = useState(true);

  const { user, logout } = useAuth();
  const location = useLocation();
  const authenticated = !!user;

  useEffect(() => {
    if (location.pathname != `/`){
      setPathHome(false)
    } else if (location.pathname === "/"){
      setPathHome(true)
    }
  
  }, [location.pathname])
  
    
  

  const swapMenu = () => {
    setMenuOn(!menuOn);
  };

  const offMenu = () => {
    setMenuOn(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav
      className="pl-6 pr-2 shadow-lg fixed top-0 w-full z-30 transition-colors duration-300 text-white bg-[#23252b]"
    >
      <MenuDrawer menuOn={menuOn} swapMenu={swapMenu} />

      <div className="flex justify-between items-center">
        <div className='flex items-center space-x-5'>
          <IoMenu
            size={24}
            aria-label='ham-menu'
            onClick={swapMenu}
            className='cursor-pointer select-none active:scale-95'
          />
          <Link to="/" className="select-none text-gradient">
            ANIVERSE
          </Link>
        </div>

        {/* Searchbar Container */}
        <SearchBar />


        <ul className="flex">
          <li className='flex justify-items-center'>
            <NavLink to="/" onClick={offMenu} className={"hover:bg-[#141519] transition duration-300 p-[1.15rem] flex flex-row items-center gap-[0.125rem]"}>
              <BiHomeAlt2 size={18} /> <span> Home </span>
            </NavLink>
          </li>
          <li className='flex justify-items-center'>
            <NavLink to="/about" onClick={offMenu} className={"hover:bg-[#141519] transition duration-300 p-[1.15rem] flex flex-row items-center gap-[0.125rem]"}>
              <LuInfo size={18} /> <span> About </span>
            </NavLink>
          </li>
          {authenticated ? (
            <li className='flex justify-items-center'>
              <NavLink to="/" onClick={handleLogout} className={"hover:bg-[#141519] transition duration-300 p-[1.15rem] flex flex-row items-center gap-[0.125rem]"}>
                <IoIosLogOut size={18} /> <span> Logout </span>
              </NavLink>
            </li>
          ) : (
            <li className='flex justify-items-center'>
              <NavLink to="/auth/login" onClick={offMenu} className={"hover:bg-[#141519] transition duration-300 p-[1.15rem] flex flex-row items-center gap-[0.125rem]"}>
                <VscAccount size={18} /> <span> Login </span>
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
