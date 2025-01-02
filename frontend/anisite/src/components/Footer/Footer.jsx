import React from 'react';
import { FaLinkedin, FaTwitter, FaInstagram, FaGithub, FaKaggle } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-[#1b1b1b] text-white pt-10 font-sans">
      <div className="container mx-auto px-4 flex flex-col items-center space-y-6">

        <div className="text-center">
          <h1 className="text-3xl font-bold uppercase tracking-wide">
            Aniverse
          </h1>
          <p className="text-gray-400 mt-2 max-w-md">
            Your All-in-One Anime Platform. Explore. Discover. Interact.
          </p>
        </div>

        <div className="flex space-x-6">
          <a
            href="https://www.linkedin.com/in/mridul-narula-55338524b/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#0a66c2] transform hover:scale-110 transition"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={28} />
          </a>
          <a
            href="https://x.com/mridulnarula_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#1da1f2] transform hover:scale-110 transition"
            aria-label="Twitter"
          >
            <FaTwitter size={28} />
          </a>
          <a
            href="https://instagram.com/mridul23_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#e1306c] transform hover:scale-110 transition"
            aria-label="Instagram"
          >
            <FaInstagram size={28} />
          </a>
          <a
            href="https://github.com/Mridul-23"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-300 transform hover:scale-110 transition"
            aria-label="GitHub"
          >
            <FaGithub size={28} />
          </a>
          <a
            href="https://kaggle.com/mridulnarula"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#20beff] transform hover:scale-110 transition"
            aria-label="Kaggle"
          >
            <FaKaggle size={28} />
          </a>
        </div>
      </div>

      <div className="w-full h-px bg-gray-700 my-8"></div>

      <div className="container mx-auto px-4 pb-8 text-center text-gray-500 text-sm">
        <p>
          &copy; 2024 Aniverse | Designed by 
          <a 
            href="https://www.linkedin.com/in/mridul-narula-55338524b/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 font-semibold hover:underline"
            > 
              <em> Mridul Narula</em>
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
