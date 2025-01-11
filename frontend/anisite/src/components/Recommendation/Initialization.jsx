import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Initialization = () => {
  const navigate = useNavigate()
  const [animes, setAnimes] = useState([
    { name: "", rating: "" },
    { name: "", rating: "" },
    { name: "", rating: "" },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedAnimes = [...animes];
    updatedAnimes[index][field] = value;
    setAnimes(updatedAnimes);
  };

  const addAnimeComponent = () => {
    setAnimes([...animes, { name: "", rating: "" }]);
  };

  const handleSubmit = async () => {
    try {
      const getResponse = await axios.get("https://128.0.0.1:8000/start_recommendations", {
        params: { animes: JSON.stringify(animes) },
      });

      if (getResponse.status === 200) {
        console.log("GET response received:", getResponse.data);

        const postResponse = await axios.post(
          "https://128.0.0.1:8000/start_recommendations_data",
          {
            recommendations: getResponse.data,
          }
        );
        
        if (postResponse.status === 200) {
          console.log("POST response received:", postResponse.data);

          navigate("/start");
        } else {
          alert("Error in POST request!");
        }
      } else {
        alert("Error in GET request!");
      }
    } catch (error) {
      console.error("Error occurred during the request flow:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen mt-14 bg-[#121212] text-gray-200 p-6">
      <div className="max-w-3xl mx-auto bg-[#272a30] shadow-lg p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center uppercase">Give us your Favorites</h1>
        {animes.map((anime, index) => (
          <div
            key={index}
            className="flex flex-row gap-4 bg-transparent px-4 pb-4 pt-2 rounded"
          >
            <input
              type="text"
              placeholder="Anime Name"
              value={anime.name}
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
              className="flex-grow p-2 rounded bg-neutral-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Rating (1-5)"
              value={anime.rating}
              min={1}
              max={5}
              onChange={(e) => handleInputChange(index, "rating", e.target.value)}
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
