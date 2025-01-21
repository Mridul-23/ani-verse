import React, { useEffect, useState } from "react";
import { getAnimeDetails } from "../../utils/api";
import { useParams } from "react-router-dom";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { BsCollection, BsCollectionFill  } from "react-icons/bs";
import { animeSimpleRecommendation } from "../../utils/api";

import "./AnimeDetails.css";
import GenreSlider from "../Home/GenreSlider";

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState({});
  const [recData, setRecData] = useState([])
  const [fav, setFav] = useState(false);
  const [later, setLater] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const favToggle = () => {
    setFav(!fav);
  };

  const laterToggle = () => {
    setLater(!later);
  };

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const animeData = await getAnimeDetails(id);
        setAnime(animeData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchAnimeRecommendations = async () => {
      try {
        const animeRec = await animeSimpleRecommendation(id);
        console.log(`Rec Data : ${animeRec}`);
        
        const finalData = [{
          name: "",
          animeList : animeRec
        }]
        setRecData(finalData);
      }
      catch (err) {
        console.error(err);
      }
    };

    fetchAnimeDetails();
    fetchAnimeRecommendations();
  }, [id]);

  console.log(recData);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-14 bg-gray-900 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto bg-slate-800 sub-main-bg rounded-lg shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Anime Image */} 
          <div className="flex-shrink-0 space-y-4 ">
            <img
              src={anime.imagelink}
              alt={anime.name || "Anime Cover"}
              className="w-full lg:w-72 h-auto rounded-lg shadow-lg object-cover"
            />
            <div className="flex items-center justify-center gap-1 border p-2 text-sm sub-bt-bg border-slate-400 active:scale-[0.97] transform transition duration-300"
              onClick={favToggle}
            >
            {!fav ? <FcLike size={15}/> : <FcLikePlaceholder size={15}/>}
              <span>Add To Favorites</span>
            </div>
            <div className="flex items-center justify-center gap-1 border p-2 text-sm sub-bt-bg border-slate-400 active:scale-[0.97] transform transition duration-300"
              onClick={laterToggle}
            >
            {!later ? <BsCollectionFill size={15} color="#a6bde0"/> : <BsCollectionFill size={15} color="#5396fc"/>}
              <span>Add To Favorites</span>
            </div>
          </div>

          <div className="bg-gray-700 w-[0.5px] h-96 self-center" />

          {/* Anime Details */}
          <div className="flex-1">
            <div className="flex justify-between items-center flex-row gap-8">
              <h1 className="text-4xl font-bold uppercase mb-2">{anime.name_english || "Unknown Anime"}</h1>
            </div>
            <p className="text-gray-400 mb-4"> Original Name: <em>{anime.name || "No English Title"}</em> </p>
            <div className="flex flex-wrap mb-4 space-x-2">
              <span className=" sub-text-bg active:shadow-none cursor-default text-sm px-3 py-1 rounded-full">
                {anime.source || "Unknown Source"}
              </span>
              <span className="sub-text-bg active:shadow-none cursor-default text-sm px-3 py-1 rounded-full">
                {anime.typeof || "Unknown Type"}
              </span>
              <span className=" sub-text-bg active:shadow-none cursor-default text-sm px-3 py-1 rounded-full">
                {anime.premiered || "Unknown Season"}
              </span>
            </div>
            <p className="text-lg text-blue-400 mb-2">Score: {anime.score?.toFixed(2) || "N/A"}</p>
            <div className="text-gray-300 space-y-2">
              <p>
                <strong>Ranked:</strong> {anime.ranked || "N/A"}
              </p>
              <p>
                <strong>Popularity:</strong> {anime.popularity || "N/A"}
              </p>
              <p>
                <strong>Studio:</strong> {anime.studio || "Unknown"}
              </p>
              <p>
                <strong>Genre:</strong> {anime.genre?.join(", ") || "N/A"}
              </p>
              <p>
                <strong>Demographic:</strong> {anime.demographic || "N/A"}
              </p>
              <p>
                <strong>Total Episodes:</strong> {anime.total_episodes || "N/A"}
              </p>
              <p>
                <strong>Aired:</strong> {anime.aired || "N/A"}
              </p>
              <p>
                <strong>Duration per Episode:</strong> {anime.duration_per_ep || "N/A"}
              </p>
              <p>
                <strong>Rating:</strong> {anime.rating || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className=" my-10 bg-gray-700 w-full h-[0.5px]" />

        {/* Synopsis Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold uppercase mb-3">Synopsis</h2>
          <p className="text-gray-300">{anime.synopsis || "No synopsis available."}</p>
        </div>

        <div className=" my-10 bg-gray-700 w-full h-[0.5px]" />

        {/* Additional Details Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold uppercase mb-6">Statistics</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-300">
            <p>
              <strong>Watching:</strong> {anime.watching || 0}
            </p>
            <p>
              <strong>Completed:</strong> {anime.completed || 0}
            </p>
            <p>
              <strong>On Hold:</strong> {anime.on_hold || 0}
            </p>
            <p>
              <strong>Dropped:</strong> {anime.dropped || 0}
            </p>
            <p>
              <strong>Plan to Watch:</strong> {anime.plan_to_watch || 0}
            </p>
            <p>
              <strong>Total Members:</strong> {anime.members || 0}
            </p>
          </div>
        </div>

        <div className=" mt-10 bg-gray-700 w-full h-[0.5px]" />

        <div className="">
          <GenreSlider genres={recData}
          heading={`Anime Similar to ${anime.name_english}`}
          head_size="2"
          styles="w-auto bg-transparent"
          />
        </div>

      </div>
    </div>
  );
};

export default AnimeDetails;
