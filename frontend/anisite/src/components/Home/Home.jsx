import React from 'react'
import PFrame from './PFrame'
import Hcon from './Hcon'

function Home() {
  return (
    <div className='flex flex-col items-center'>
      <PFrame source={"https://img.freepik.com/free-photo/bright-pop-landscape-design_23-2149213461.jpg?t=st=1734532435~exp=1734536035~hmac=d41e5d7de25ced22ffaa772e61cfe8d358e0d242b4f0f008fb188ffe5c325bb7&w=826"} 
      content={"ANIVERSE"}
      />

      <Hcon
      captions={"Welcome Senpai"} 
      gradient={{from: "#dc80f3", via: "#c500b8", to: "#ff4364"}}
      flexdir='flex-col'
      content='Aniverse is your ready to go All-in-One Anime Platform. Discover and Interact with the Anime Community. Get the latest updates on your favorite Anime Series and Movies.'
      content2='Explore the world of Anime with Aniverse'
      />

      <div className=''>
        <h1 className='text-4xl text-slate-300 font-bold text-center m-8'>
          Pick Your Show
        </h1>
        <div className='flex justify-center space-x-4 m-8'>
          <div className='bg-gray-800 shadow-md w-[200px] h-[270px] overflow-hidden cursor-pointer'>
            <img src="https://cdn.myanimelist.net/images/anime/1517/100633l.jpg" alt="Shingeki No Kyojin" 
              className=' object-center object-cover w-full h-full hover:scale-105 transition-all'  />
          </div>
          <div className='bg-gray-800 shadow-md w-[200px] h-[270px] overflow-hidden cursor-pointer'>
            <img src="https://cdn.myanimelist.net/images/anime/1908/120036l.jpg" alt="Kimetsu No Yaiba" 
              className=' object-center object-cover w-full h-full hover:scale-105 transition-all'  />
          </div>
          <div className='bg-gray-800 shadow-md w-[200px] h-[270px] overflow-hidden cursor-pointer'>
            <img src="https://cdn.myanimelist.net/images/anime/1011/120243l.jpg" alt="One Piece" 
              className=' object-center object-cover w-full h-full hover:scale-105 transition-all'  />
          </div>
          <div className='bg-gray-800 shadow-md w-[200px] h-[270px] overflow-hidden cursor-pointer'>
            <img src="https://cdn.myanimelist.net/images/anime/1541/142082l.jpg" alt="Dandadan" 
              className=' object-center object-cover w-full h-full hover:scale-105 transition-all'  />
          </div>
        </div>
      </div>

      <div>
        <div>
          
        </div>
      </div>
    </div>
  )
}

export default Home