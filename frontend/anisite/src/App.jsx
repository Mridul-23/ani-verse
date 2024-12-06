import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'

function App() {

  return (
    <>
    <Navbar></Navbar>
      <h1 className='font-bold bg-red-600 rounded-md text-white self-center justify-self-center px-4 py-2 m-10 cursor-pointer select-none'>React App</h1>
    </>
  )
}

export default App
