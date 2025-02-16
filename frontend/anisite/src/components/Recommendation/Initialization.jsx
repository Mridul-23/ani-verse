import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Initialization = () => {
  const [animes, setAnimes] = useState([
    { id: '', name: "", rating: '', search: "", results: [] },
    { id: '', name: "", rating: '', search: "", results: [] },
    { id: '', name: "", rating: '', search: "", results: [] }
  ]);
  const navigate = useNavigate();

  // Fetch anime list based on search query for specific anime input
  const fetchAnimeList = async (index, query) => {
    try {
      const animeData = await axios.get(`http://127.0.0.1:8000/search_anime/?anime_name=${query}`);
      const updatedAnimes = [...animes];
      updatedAnimes[index].results = animeData.data; // Store search results for that input
      setAnimes(updatedAnimes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
    try {
      await axios.delete('http://127.0.0.1:8000/recommendations/initialize/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      })} catch (error) {
      console.error('Failed to delete recommendation session:', error);
      }
    })();
  }, [])
  

  // Handle input changes for anime name or rating
  const handleInputChange = (index, field, e) => {
    const value = e.target.value;
    const updatedAnimes = [...animes];

    if (field === "name") {
      updatedAnimes[index].search = value; // Track the search query for the specific input
      fetchAnimeList(index, value); // Trigger anime search for that input
    }

    updatedAnimes[index][field] = value;
    setAnimes(updatedAnimes);
  };

  // Select anime from search results for specific input
  const handleSelectAnime = (index, animeName, id) => {
    const updatedAnimes = [...animes];
    updatedAnimes[index].name = animeName;
    updatedAnimes[index].id = id;
    updatedAnimes[index].results = []; // Clear search results after selection
    setAnimes(updatedAnimes);
  };

  // Add a new anime entry field
  const addAnimeComponent = () => {
    if (animes.length < 6) {
      setAnimes([...animes, { name: "", rating: "", search: "", results: [] }]);
    }
  };

  // Validate and submit the form
  const handleSubmit = async () => {
    if (animes.length < 3) {
      alert("Please provide at least 3 anime.");
      return;
    }

    // Extract show IDs and ratings
    const showIds = animes.map(anime => anime.id).filter(id => id !== undefined);
    const showRatings = animes.map(anime => parseInt(anime.rating) || 0);
    console.log(showIds, showRatings);

    if (showIds.length < 3) {
      alert("Please select at least 3 anime from the search results.");
      return;
    }


    try {
      const postResponse = await axios.post(
        "http://127.0.0.1:8000/recommendations/initialize/", {
        show_ids: showIds,
        show_ratings: showRatings,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      });

      if (postResponse.status === 200) {
        console.log("POST response received:", postResponse.data);
        navigate("/recommendation/start");
      } else {
        alert("Error in POST request!");
      }
    } catch (error) {
      console.error("Error occurred during the request flow:", error);
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    console.log(animes);
  }, [animes]);

  return (
    <div className="min-h-screen mt-14 bg-[#121212] text-gray-200 p-6">
      <div className="max-w-3xl mx-auto bg-[#272a30] shadow-lg p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center uppercase">
          Give us your Favorites
        </h1>
        {animes.map((anime, index) => (
          <div
            key={index}
            className="relative flex flex-row gap-4 bg-transparent px-4 pb-4 pt-2 rounded"
          >
            <input
              type="text"
              placeholder="Anime Name"
              value={anime.name}
              onChange={(e) => handleInputChange(index, "name", e)}
              className="flex-grow p-2 rounded bg-neutral-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Display search results if there are any */}
            {anime.results.length > 0 && anime.search && (
              <div className="absolute search-scrollbar bg-neutral-800 text-gray-200 rounded mt-10 p-2 z-10 max-w-[25rem] max-h-48 overflow-y-auto">
                {anime.results.map((item, animeIndex) => (
                  <div
                  to={`/anime/details/${item.unique_id}`}
                  className="flex cursor-pointer items-center gap-4 px-4 py-3 hover:bg-[#2a2a2a] transition duration-300"
                  key={animeIndex}
                  title={item.name_english}
                  onClick={() => handleSelectAnime(index, item.name, item.unique_id)}
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

            <input
              type="number"
              placeholder="Rating (1-5)"
              value={anime.rating}
              min={1}
              max={5}
              onChange={(e) => handleInputChange(index, "rating", e)}
              className="flex-grow p-2 rounded bg-neutral-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <button
          onClick={addAnimeComponent}
          className="w-full mt-4 bg-gray-700 hover:bg-neutral-900 duration-300 text-gray-100 font-semibold py-2 px-4 rounded mb-4"
        >
          + Add Anime
        </button>
        <button
          onClick={handleSubmit}
          className="w-full bg-slate-700 hover:bg-gray-900 duration-300 text-gray-200 font-semibold py-2 px-4 rounded"
        >
          GetRec
        </button>
      </div>
    </div>
  );
};

export default Initialization;
