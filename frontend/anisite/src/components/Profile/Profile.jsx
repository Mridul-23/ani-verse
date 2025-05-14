import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimeListItem from './AnimeListItem';  // Import AnimeListItem component

function Profile() {
  const [userProfileData, setUserProfileData] = useState({});
  const [toggleShowLists, setToggleShowLists] = useState(true);

  // Fetch user profile data
  const getProfile = async () => {
    const response = await axios.get('http://127.0.0.1:8000/user/profile/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`
      }
    });

    setUserProfileData(response.data);
  };

  // Fetch favourite anime
  const fetchFavourite = async () => {
    const response = await axios.get('http://127.0.0.1:8000/user/favourite/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`
      }
    });

    setUserProfileData((prev) => ({
      ...prev,
      saved_anime: response.data
    }));
  };
  
  // Fetch watch later anime
  const fetchWatchLater = async () => {
    const response = await axios.get('http://127.0.0.1:8000/user/watch_later/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`
      }
    });

    setUserProfileData((prev) => ({
      ...prev,
      watchLater_anime: response.data
    }));
  };

  useEffect(() => {
    getProfile();
    fetchFavourite();
    fetchWatchLater();
  }, []);

  return (
    <div className="flex flex-col mt-14 w-full bg-gray-800 text-white rounded-lg shadow-xl">
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
            <p className="text-sm mt-1 overflow-auto scroll-none text-gray-300 h-36 w-[80%]">{userProfileData.bio}</p>
          </div>

          <div className="bg-gray-700 rounded-t-md flex justify-start ml-6 w-[95%]">
            <div className={`w-[50%] text-center py-4 ${toggleShowLists ? 'bg-slate-500 transition-all duration-300' : 'bg-inherit'}`}>
              <button onClick={() => setToggleShowLists(true)}>
                <h3 className="text-xl font-medium">Favourite Shows</h3>
              </button>
            </div>
            <div className={`w-[50%] text-center py-4 ${toggleShowLists ? 'bg-inherit' : 'bg-slate-500 transition-all duration-300'}`}>
              <button onClick={() => setToggleShowLists(false)}>
                <h3 className="text-xl font-medium">Watch Later</h3>
              </button>
            </div>
          </div>

          <div className='w-[35rem] ml-6 pb-6'>
            {toggleShowLists && userProfileData?.saved_anime?.map((anime) => (
              <AnimeListItem key={anime.unique_id} anime={anime.anime} />
            ))}

            {!toggleShowLists && userProfileData?.watchLater_anime?.map((anime) => (
              <AnimeListItem key={anime.id} anime={anime.anime} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;