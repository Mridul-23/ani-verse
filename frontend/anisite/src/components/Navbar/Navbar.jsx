import React, { useState, useEffect } from 'react';
import { LuInfo } from "react-icons/lu";
import { IoMenu } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";
import { Link, Links, NavLink, useLocation } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { BiHomeAlt2 } from "react-icons/bi";
import MenuDrawer from './MenuDrawer';
import useAuth from '../../hooks/useAuth';
import { searchAnime } from '../../utils/api';
import useDebounce from '../../hooks/useDebounce';

const Navbar = () => {
  const [menuOn, setMenuOn] = useState(false);
  const [pathHome, setPathHome] = useState(true);
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])

  const { user, logout } = useAuth();
  const location = useLocation();
  const debouncedSearch = useDebounce(search, 500)
  const authenticated = !!user;

  useEffect(() => {
    if (location.pathname != `/`){
      setPathHome(false)
    } else if (location.pathname === "/"){
      setPathHome(true)
    }
  
  }, [location.pathname])
  

  useEffect(() => {
      if (debouncedSearch.length === 0) {
        setResults([]);
        return;
      }
  
      const resultFetcher = async () => {
        try {
          const animeData = await searchAnime(debouncedSearch);
          setResults(animeData);
        } catch (err) {
          setError("Failed to fetch anime details: " + err.message);
        }
      };
  
      resultFetcher();
    }, [debouncedSearch]);

    console.log(results);
    
  

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
        <div className={`${pathHome ? "" : "hidden"} relative flex flex-col items-center w-full`}>
          {/* Search Input */}
          <input
            type="text"
            id="search-bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-96 p-2 text-sm rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md transition-all"
            placeholder="Search for your favorite anime..."
            autoComplete="off"
          />

          {/* Results Overlay */}
          <div
            className={`absolute top-full mt-2 w-96 rounded-b-xl bg-[#1f1f1f] shadow-xl border border-gray-700 overflow-x-hidden  max-h-[28rem] ${
              search ? "" : "hidden"
            } z-50 overflow-scroll ${results.length>0 ? "search-scrollbar" : "scroll-none" } `}
          >
            <ul className="divide-y divide-gray-700">
              {results.length > 0 ? (
                results.map((anime, animeIndex) => (
                  <li key={animeIndex}>
                    <Link
                      to={`/anime/details/${anime.unique_id}`}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-[#2a2a2a] transition duration-300"
                      key={animeIndex}
                      title={anime.name_english}
                    >
                      <img
                        src={anime.imagelink}
                        alt={anime.name}
                        className="h-10 w-10 rounded-lg object-cover bg-gray-700"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">
                          {anime.name}
                        </span>
                        <span className="text-xs text-gray-400 italic">
                          {anime.name_english}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-sm text-gray-400 italic">
                  No results found.
                </li>
              )}
            </ul>
          </div>
        </div>


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
