import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { IoIosClose } from "react-icons/io";
import { BiUserCircle, BiCompass, BiPhoneCall, BiListCheck } from "react-icons/bi";

function MenuDrawer({ menuOn, swapMenu }) {
  return (
    <div
      className={`fixed top-0 left-0 h-full max-w-sm bg-[#23252b] text-white shadow-lg z-50 transform ${
        menuOn ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >

      <div className="px-6 py-[0.875rem] border-b text-center border-gray-600 flex items-center space-x-3">
        <button
          onClick={swapMenu}
          aria-label="Close Menu"
          className=" text-gray-400 hover:text-white text-[1.69rem] rounded-full bg-gradient-to-tl hover:from-[#1b1b1b] hover:to-[#4b5563] transition-all"
        >
          <IoIosClose />
        </button>
        <h2 className="text-2xl font-thin uppercase font-sans">Menu</h2>
      </div>

      <ul className="flex flex-col mt-4 space-y-4 px-6">
        <li>
          <Link
            to="/profile"
            className="flex items-center space-x-3 text-gray-400 hover:text-white"
            onClick={swapMenu}
          >
            <BiUserCircle size={20} />
            <span>Your Profile</span>
          </Link>
        </li>
        <li>
          <Link
            to="/explore"
            className="flex items-center space-x-3 text-gray-400 hover:text-white"
            onClick={swapMenu}
          >
            <BiCompass size={20} />
            <span>Explore</span>
          </Link>
        </li>
        <li>
          <Link
            to="/recommendation/init"
            className="flex items-center space-x-3 text-gray-400 hover:text-white"
            onClick={swapMenu}
          >
            <AiOutlineHeart size={20} />
            <span>Recommendations</span>
          </Link>
        </li>
        <li>
          <Link
            to="/search"
            className="flex items-center space-x-3 text-gray-400 hover:text-white"
            onClick={swapMenu}
          >
            <BiListCheck size={20} />
            <span>Anime List</span>
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className="flex items-center space-x-3 text-gray-400 hover:text-white"
            onClick={swapMenu}
          >
            <BiPhoneCall size={20} />
            <span>Contact Us</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default MenuDrawer;
