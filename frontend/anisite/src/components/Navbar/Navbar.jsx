import React from 'react'

function Navbar() {
  return (
    <nav className='bg-gray-800 flex flex-col items-center text-white p-[0.85rem] sm:flex-row'>
      <h1 className='text-2xl font-bold flex-grow sm:ml-5'>AniSite</h1>
      <ul className='flex text-center flex-col sm:flex-row sm:space-x-5'>
        <li className='cursor-pointer border-gray-800 rounded-3xl px-4 py-[0.35rem] border-[0.1px] text-lg hover:border-white transition-all'>Home</li>
        <li className='cursor-pointer border-gray-800 rounded-3xl px-4 py-[0.35rem] border-[0.1px] text-lg hover:border-white transition-all'>About</li>
        <li className='cursor-pointer border-gray-800 rounded-3xl px-4 py-[0.35rem] border-[0.1px] text-lg hover:border-white transition-all'>Contact</li>
        <li className='cursor-pointer border-gray-800 rounded-3xl px-4 py-[0.35rem] border-[0.1px] text-lg hover:border-white transition-all'>Services</li>
      </ul>
    </nav>
  )
}

export default Navbar