import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import AnimeListItem from './AnimeListItem';

export default function Profile() {
  const [userProfileData, setUserProfileData] = useState({});
  const [toggleShowLists, setToggleShowLists] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingBio, setSavingBio] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile data
  const getProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await axios.get('http://127.0.0.1:8000/user/profile/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` }
      });
      setUserProfileData(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Could not load profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  // Update bio
  const saveBio = async () => {
    try {
      setSavingBio(true);
      const { data } = await axios.patch(
        'http://127.0.0.1:8000/user/profile/',
        { bio: bioInput },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` } }
      );
      setUserProfileData(prev => ({ ...prev, bio: data.bio }));
      setIsEditingBio(false);
    } catch {
      setError('Failed to update bio');
    } finally {
      setSavingBio(false);
    }
  };

  // Fetch lists
  const fetchFavourite = async () => {
    const { data } = await axios.get('http://127.0.0.1:8000/user/favourite/', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` }
    });
    setUserProfileData(prev => ({ ...prev, saved_anime: data }));
  };
  const fetchWatchLater = async () => {
    const { data } = await axios.get('http://127.0.0.1:8000/user/watch_later/', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` }
    });
    setUserProfileData(prev => ({ ...prev, watchLater_anime: data }));
  };

  useEffect(() => { getProfile(); fetchFavourite(); fetchWatchLater(); }, []);
  useEffect(() => { setBioInput(userProfileData.bio || ''); }, [userProfileData.bio]);

  if (loadingProfile) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="min-h-screen min-[900px]:mt-14 bg-gray-900 text-white py-8 px-4">
      <div className="mx-auto my-10 sm:p-6 bg-gray-800 text-white max-w-6xl sub-main-bg rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar & Favourite */}
          <div className="flex-shrink-0 text-center md:text-left">
            <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto md:mx-0 border-4 border-white rounded-full overflow-hidden shadow-lg">
              <img
                src={userProfileData.pfp}
                alt="Profile"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-3 text-gray-300">
              <p className="text-sm">Favourite Anime:</p>
              <p className="font-semibold truncate max-w-xs">{userProfileData.favourite_anime}</p>
            </div>
          </div>

          {/* Details & Bio */}
          <div className="flex-1 w-full">
            <h2 className="text-2xl sm:text-3xl sm:text-left text-center font-bold">{userProfileData.name}</h2>

            <div className="mt-4 relative">
              {isEditingBio ? (
                <div className="relative">
                  <textarea
                    className="resize-none scroll-none w-full h-36 p-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    maxLength={500}
                  />
                  <div className={`absolute bottom-2 right-2 text-xs ${
                    bioInput.length > 450 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {bioInput.length} / 500
                  </div>
                </div>
              ) : (
                <p className="text-sm mt-1 overflow-auto scroll-none text-gray-300 h-36 w-full">
                  {userProfileData.bio || "No bio added yet."}
                </p>
              )}
              <div className="absolute top-2 right-2 flex items-center space-x-2">
                {isEditingBio ? (
                  <>
                    <FiCheck
                      size={20}
                      className="cursor-pointer hover:text-green-300"
                      onClick={saveBio}
                      disabled={savingBio}
                    />
                    <FiX
                      size={20}
                      className="cursor-pointer hover:text-red-300"
                      onClick={() => {
                        setIsEditingBio(false);
                        setBioInput(userProfileData.bio || '');
                      }}
                    />
                  </>
                ) : (
                  <FiEdit2
                    size={20}
                    className="cursor-pointer hover:text-gray-400"
                    onClick={() => setIsEditingBio(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 bg-gray-700 rounded-xl overflow-hidden w-full sm:max-w-md mx-auto">
          <div className="flex">
            {['Favourite Shows', 'Watch Later'].map((tab, idx) => {
              const active = (idx === 0 && toggleShowLists) || (idx === 1 && !toggleShowLists);
              return (
                <button
                  key={tab}
                  onClick={() => setToggleShowLists(idx === 0)}
                  className={`flex-1 py-3 text-center font-medium transition-colors ${
                    active ? 'bg-[#006f77] text-white' : 'text-gray-300 hover:bg-[#205155a9]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* List Items */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 ">
          {(toggleShowLists
            ? userProfileData.saved_anime
            : userProfileData.watchLater_anime
          )?.map((item, idx) => (
            <AnimeListItem key={idx} anime={item.anime} />
          ))}
        </div>
      </div>
    </div>
  );
}
