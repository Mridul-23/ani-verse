import React from 'react'

function Hcon({
    captions = "Anime", 
    gradient = {from: "#4292e2", via: "#2894ff", to: "#96eaf6"},
    flexdir = "flex-row",
    content = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, necessitatibus.",
    content2 = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, necessitatibus."

}) {
  return (
    <>
      <div className={`mx-4 shadow-md w-[100%] flex items-center justify-center ${flexdir}`}>

        <div aria-description='content' className='flex justify-center items-center mt-8' id='switch-c-1'>
          <p className='text-gray-500 text-center text-lg leading-6 w-[75%] font-semibold font-sans'>
            {content}
            <span className='block'>
              {content2}
            </span>
          </p>
        </div>

        <h1 className='text-transparent bg-clip-text text-[3.25rem] leading-none select-none text-center m-8 font-bold font-sans uppercase'
        style={{backgroundImage: `linear-gradient(to right, ${gradient.from}, ${gradient.via}, ${gradient.to})`}}>
          {captions}
        </h1>

      </div>
    </>
  )
}

export default Hcon