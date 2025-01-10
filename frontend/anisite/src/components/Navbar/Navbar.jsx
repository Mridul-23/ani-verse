import React, { useState, useEffect } from 'react';
import { LuInfo } from "react-icons/lu";
import { IoMenu } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";
import { GiPlanetCore } from "react-icons/gi";
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BiHomeAlt2, BiSearchAlt } from "react-icons/bi";
import MenuDrawer from './MenuDrawer';

const Navbar = ({
  authenticated = false
}) => {
  const [menuOn, setMenuOn] = useState(false)
  const [isScrolledPast, setIsScrolledPast] = useState(false);
  const location = useLocation();

  const swapMenu = () => {
    setMenuOn(!menuOn);
  }

  const offMenu = () => {
    setMenuOn(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('switch-c-1');
      if (element) {
        const rect = element.getBoundingClientRect();
        setIsScrolledPast(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsScrolledPast(false);
  }
  , [location]);


  return (
    <nav
      className={`pl-6 pr-2 shadow-lg fixed top-0 w-full z-50 transition-colors duration-300 text-white ${
        isScrolledPast ? 'bg-[#0f0f0f]' : 'bg-[#23252b]'
      }`}>

      <MenuDrawer menuOn={menuOn} swapMenu={swapMenu} />

      <div className="flex justify-between items-center">
        <div className='flex items-center space-x-5'>
          <IoMenu size={24}
          aria-label='ham-menu'
          onClick={swapMenu}
          className='cursor-pointer select-none active:scale-95'
          />
          <Link to="/" className="select-none text-gradient">
<<<<<<< HEAD
            ANIVERSE </Link>
=======
            ANIME </Link>
>>>>>>> 1b7cc0b895b6ad351c87ff43246c8e297621b501

        </div>
        <ul className="flex">
          <li className='flex justify-items-center'><NavLink to="/" onClick={offMenu} className={`hover:${isScrolledPast ? 'bg-[#23252b]' : 'bg-[#141519]'} transition duration-300 p-[1.15rem] flex flex-row items-center gap-[0.125rem]`}> <BiHomeAlt2 size={18}/> <span> Home </span> </NavLink></li>
          <li className='flex justify-items-center'><NavLink to="/about" onClick={offMenu} className={`hover:${isScrolledPast ? 'bg-[#23252b]' : 'bg-[#141519]'} transition duration-300 p-[1.15rem] flex flex-row items-center gap-[0.125rem]`}> <LuInfo size={18} /> <span> About </span> </NavLink></li>
          <li className='flex justify-items-center'><NavLink to="/search" onClick={offMenu} className={`hover:${isScrolledPast ? 'bg-[#23252b]' : 'bg-[#141519]'} transition duration-300 p-[1.15rem] flex flex-row items-center gap-[0.125rem]`}> <BiSearchAlt size={18}/> <span> Search </span></NavLink></li>
          { authenticated ? (
            <li className='flex justify-items-center'><NavLink to="/profile" onClick={offMenu} className={`hover:${isScrolledPast ? 'bg-[#23252b]' : 'bg-[#141519]'} transition duration-300 p-[1.15rem] flex flex-row items-center gap-[0.125rem]`}> <GiPlanetCore size={18} /> <span> User </span></NavLink></li>
          ) : (
            <li className='flex justify-items-center'><NavLink to="/login" onClick={offMenu} className={`hover:${isScrolledPast ? 'bg-[#23252b]' : 'bg-[#141519]'} transition duration-300 p-[1.15rem] flex flex-row items-center gap-[0.125rem]`}> <VscAccount size={18} /> <span> Login </span></NavLink></li>
          )}
          </ul>
      </div>
    </nav>
  );
};

export default Navbar;