import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiEdit2, FiCheck, FiX, FiCamera } from "react-icons/fi";
import AnimeListItem from "./AnimeListItem";
import { Link } from "react-router-dom";
import BASE_URL from "../../../config";

export default function Profile() {
  const [userProfileData, setUserProfileData] = useState({});
  const [toggleShowLists, setToggleShowLists] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");

  const [isEditingFavourite, setIsEditingFavourite] = useState(false);
  const [favouriteInput, setFavouriteInput] = useState("");
  const [favouriteId, setFavouriteId] = useState(null);
  const [favouriteResults, setFavouriteResults] = useState([]);

  const [isEditingPfp, setIsEditingPfp] = useState(false);
  const [pfpFile, setPfpFile] = useState(null);
  const [savingPfp, setSavingPfp] = useState(false);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingBio, setSavingBio] = useState(false);
  const [savingFavourite, setSavingFavourite] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const getProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await axios.get(`${BASE_URL}/user/profile/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setUserProfileData(response.data);

      if (response.data.favourite_anime_name) {
        setFavouriteInput(response.data.favourite_anime_name);
        setFavouriteId(response.data.favourite_anime || null);
      } else {
        setFavouriteInput("");
        setFavouriteId(null);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Could not load profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchFavourite = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/user/favourite/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setUserProfileData((prev) => ({ ...prev, saved_anime: data }));
    } catch (err) {
      console.error("Error fetching saved_favourite:", err);
    }
  };

  const fetchWatchLater = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/user/watch_later/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setUserProfileData((prev) => ({ ...prev, watchLater_anime: data }));
    } catch (err) {
      console.error("Error fetching watch_later:", err);
    }
  };

  useEffect(() => {
    getProfile();
    fetchFavourite();
    fetchWatchLater();
  }, []);

  useEffect(() => {
    setBioInput(userProfileData.bio || "");
  }, [userProfileData.bio]);

  useEffect(() => {
    if (favouriteInput.trim() === "") {
      setFavouriteResults([]);
      return;
    }
    const timer = setTimeout(() => {
      fetchFavouriteList(favouriteInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [favouriteInput]);

  const fetchFavouriteList = async (query) => {
    try {
      const animeData = await axios.get(
        `${BASE_URL}/search_anime/?anime_name=${encodeURIComponent(query)}`
      );
      setFavouriteResults(animeData.data);
    } catch (err) {
      console.error("Error fetching autocomplete:", err);
    }
  };

  const handleSelectFavourite = (item) => {
    setFavouriteInput(item.name);
    setFavouriteId(item.unique_id);
    setFavouriteResults([]);
  };

  const saveFavourite = async () => {
    if (!favouriteId) {
      alert("Please select a valid anime from the suggestions.");
      return;
    }
    setSavingFavourite(true);
    try {
      const { data } = await axios.patch(
        `${BASE_URL}/user/profile/`,
        { favourite_anime: favouriteId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
      );
      setUserProfileData((prev) => ({
        ...prev,
        favourite_anime: data.favourite_anime,
        favourite_anime_name: data.favourite_anime_name,
      }));
      setIsEditingFavourite(false);
    } catch (err) {
      console.error("Failed to update favourite anime:", err);
      setError("Failed to update favourite anime");
    } finally {
      setSavingFavourite(false);
    }
  };

  const saveBio = async () => {
    try {
      setSavingBio(true);
      const { data } = await axios.patch(
        `${BASE_URL}/user/profile/`,
        { bio: bioInput },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
      );
      setUserProfileData((prev) => ({ ...prev, bio: data.bio }));
      setIsEditingBio(false);
    } catch {
      setError("Failed to update bio");
    } finally {
      setSavingBio(false);
    }
  };

  const handlePfpChange = (e) => {
    setPfpFile(e.target.files[0]);
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const savePfp = async () => {
    if (!pfpFile) return;
    setSavingPfp(true);
    try {
      const formData = new FormData();
      formData.append('pfp_upload', pfpFile);
      const { data } = await axios.patch(
        `${BASE_URL}/user/profile/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );
      setUserProfileData((prev) => ({ ...prev, pfp: data.pfp }));
      setIsEditingPfp(false);
      setPfpFile(null);
    } catch (err) {
      console.error("Failed to update profile picture:", err);
      setError("Failed to update profile picture");
    } finally {
      setSavingPfp(false);
    }
  };

  if (loadingProfile) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="min-h-screen min-[900px]:mt-14 bg-gray-900 text-white py-8 px-4">
      <div className="mx-auto my-10 sm:p-6 bg-gray-800 text-white max-w-6xl rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative ml-10 mt-5 gap-5 flex-shrink-0 text-center flex flex-col md:text-left">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => {
                handlePfpChange(e);
                setIsEditingPfp(true);
              }}
              className="hidden"
            />
            <div className="w-32 h-32 sm:w-44 sm:h-44 mx-auto md:mx-0 border-2 border-slate-950 rounded-full overflow-hidden shadow-lg">
              <img
                src={userProfileData.pfp}
                alt="Profile"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            {isEditingPfp ? (
              <div className="mt-4 flex items-center space-x-2">
                <FiCheck
                  size={20}
                  className={`cursor-pointer hover:text-green-300 ${savingPfp ? 'opacity-50 cursor-wait' : ''}`}
                  onClick={async () => {
                    await savePfp();
                    setIsEditingPfp(false);
                  }}
                /> 
                <FiX
                  size={20}
                  className="cursor-pointer hover:text-red-300"
                  onClick={() => { setIsEditingPfp(false); setPfpFile(null); }}
                />
              </div>
            ) : (
              <FiCamera
                size={30}
                className="absolute right-0 sm:right-20 cursor-pointer rounded-full p-1 bg-gray-700 hover:bg-gray-600"
                onClick={triggerFileSelect}
              />
            )}
            <div className="mt-5 sm:w-[16.5rem]">
              <p className="uppercase monster font-semibold">Favourite Anime:</p>
              {isEditingFavourite ? (
                <div className="mt-2 relative">
                  <input
                    type="text"
                    className="w-full p-2 mb-0.5 bg-gray-900 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    placeholder="Type to search..."
                    value={favouriteInput}
                    onChange={(e) => {
                      setFavouriteInput(e.target.value);
                      setFavouriteId(null);
                    }}
                    maxLength={100}
                  />
                  {favouriteResults.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 bg-neutral-800 text-gray-200 rounded max-h-48 overflow-y-auto z-10 shadow-lg">
                      {favouriteResults.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] cursor-pointer transition duration-200"
                          title={item.name_english}
                          onClick={() => handleSelectFavourite(item)}
                        >
                          <img
                            src={item.imagelink}
                            alt={item.name}
                            className="h-10 w-10 rounded-lg object-cover bg-gray-700"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-white">
                              {item.name}
                            </span>
                            <span className="text-xs text-gray-400 italic">
                              {item.name_english}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex items-center space-x-2">
                    <FiCheck
                      size={20}
                      className={`cursor-pointer hover:text-green-300 ${
                        savingFavourite ? "opacity-50 cursor-wait" : ""
                      }`}
                      onClick={saveFavourite}
                      disabled={savingFavourite}
                    />
                    <FiX
                      size={20}
                      className="cursor-pointer hover:text-red-300"
                      onClick={() => {
                        setIsEditingFavourite(false);
                        setFavouriteInput(userProfileData.favourite_anime_name || "");
                        setFavouriteId(userProfileData.favourite_anime || null);
                        setFavouriteResults([]);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center my-3.5">
                  {userProfileData.favourite_anime_name ? (
                    <Link
                      to={`/anime/details/${favouriteId}`}
                      className="block max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] shadow-md bg-gradient-to-tl from-[#194041] to-[#078e8c93] hover:bg-gradient-to-br text-white px-3 py-1 rounded-md whitespace-nowrap overflow-hidden text-ellipsis"
                      title={userProfileData.favourite_anime_name}
                    >
                      {userProfileData.favourite_anime_name}
                    </Link>

                  ) : (
                    <span className="inline-block bg-teal-900 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap overflow-hidden overflow-ellipsis">
                      No favourite anime added
                    </span>
                  )}
                  <FiEdit2
                    size={20}
                    className="cursor-pointer hover:text-gray-400 ml-2"
                    onClick={() => {
                      setIsEditingFavourite(true);
                      setFavouriteInput(userProfileData.favourite_anime_name || "");
                      setFavouriteId(userProfileData.favourite_anime || null);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* <div className="h-[0.05rem] w-60 bg-slate-400 md:w-[0.05rem] md:h-60"></div> */}

          <div className="m-5 ml-1 flex-1 w-full">
            <h2 className="text-2xl sm:text-3xl sm:text-left text-center monster uppercase font-bold">
              {userProfileData.name}
            </h2>
            <div className="mt-4 relative">
              {isEditingBio ? (
                <div className="relative">
                  <textarea
                    className="resize-none scroll-none w-full h-36 p-2 pr-12 bg-gray-900 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    maxLength={500}
                  />
                  <div
                    className={`absolute bottom-2 right-2 text-xs ${
                      bioInput.length > 450 ? "text-red-400" : "text-gray-400"
                    }`}
                  >
                    {bioInput.length} / 500
                  </div>
                </div>
              ) : (
                <p className="text-sm mt-1 w-[90%] overflow-auto scroll-none text-gray-300">
                  {userProfileData.bio || "No bio added yet."}
                </p>
              )}
              <div className="absolute top-2 right-2 flex items-center space-x-2">
                {isEditingBio ? (
                  <>
                    <FiCheck
                      size={20}
                      className={`cursor-pointer hover:text-green-300 ${
                        savingBio ? "opacity-50 cursor-wait" : ""
                      }`}
                      onClick={saveBio}
                      disabled={savingBio}
                    />
                    <FiX
                      size={20}
                      className="cursor-pointer hover:text-red-300"
                      onClick={() => {
                        setIsEditingBio(false);
                        setBioInput(userProfileData.bio || "");
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

        <div className="mt-8 bg-gray-700 rounded-xl overflow-hidden w-full sm:max-w-md mx-auto">
          <div className="flex">
            {["Favourite Shows", "Watch Later"].map((tab, idx) => {
              const active =
                (idx === 0 && toggleShowLists) ||
                (idx === 1 && !toggleShowLists);
              return (
                <button
                  key={tab}
                  onClick={() => setToggleShowLists(idx === 0)}
                  className={`flex-1 py-3 text-center font-medium transition-colors ${
                    active
                      ? "bg-[#006f77] text-white"
                      : "text-gray-300 hover:bg-[#205155a9]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

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
