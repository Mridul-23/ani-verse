import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [userProfileData, setUserProfileData] = useState({});

  const getProfile = async () => {
    const response = await axios.get('http://127.0.0.1:8000/user/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`
      }
    });

    setUserProfileData(response.data);
  };

  useEffect(() => {
    getProfile();
  }, []);

  console.log(userProfileData)

  return (

    <div className="flex flex-col mt-14 h-screen w-full bg-gray-800 text-white rounded-lg shadow-xl">


      <div className="flex p-6">
        <div>
          <div className="w-40 h-40 mx-1">
            <img
              className="w-full h-full rounded-full object-cover border-4 border-white transform hover:scale-105 transition-transform duration-200"
              src={userProfileData.pfp}
              alt="Profile"
            />
            <div className="mt-2 text-center text-gray-300">
              <p className="text-sm">Favourite Anime:</p>
              <p className="font-semibold">{userProfileData.favourite_anime}</p>
            </div>
          </div>
        </div>

        <div className='flex flex-col'>
          <div className="ml-6 mb-2">
            <h2 className="text-3xl font-semibold">{userProfileData.name}</h2>
            <p className="text-sm mt-1 overflow-auto scrollbar-hide text-gray-300 h-36 w-[80%]">{userProfileData.bio}</p>
          </div>

          <div className="px-6 py-4 bg-gray-700 rounded-b-md flex justify-start ml-6 w-[80%]">
            <div className='w-[50%]'>
              <h3 className="text-xl font-medium">Favourite Later</h3>
            </div>
            <div className='w-[50%]'>
              <h3 className="text-xl font-medium">Watch Later</h3>
            </div>
          </div>
          <div className='bg-red-800 h-96 w-[80%] ml-6 overflow-auto'>
            <div className='w-full h-20 bg-blue-700 mb-1'></div>
            <div className='w-full h-20 bg-blue-700 mb-1'></div>
            <div className='w-full h-20 bg-blue-700 mb-1'></div>
            <div className='w-full h-20 bg-blue-700 mb-1'></div>
            <div className='w-full h-20 bg-blue-700 mb-1'></div>
            <div className='w-full h-20 bg-blue-700 mb-1'></div>
            <div className='w-full h-20 bg-blue-700 mb-1'></div>
            <div className='w-full h-20 bg-blue-700 mb-1'></div>
            <div className='w-full h-20 bg-blue-700 mb-1'></div>
            <div className='w-full h-20 bg-blue-700 mb-1'></div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default Profile;
