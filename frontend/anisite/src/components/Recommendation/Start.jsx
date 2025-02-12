import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const Start = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://127.0.0.1:8000/recommendations/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
  
      setTimeout(() => {
        setRecommendations(response.data.recommendations);
        setLoading(false);
      }, 250);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("Failed to fetch recommendations. Please try again.");
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchRecommendations();
  }, []); // Fetch recommendations once on mount

  const handleRatingChange = (id, value) => {
    setRatings((prevRatings) => ({ ...prevRatings, [id]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(ratings).length === 0) {
      alert("Please rate at least one recommendation!");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/recommendations/",
        {
          show_ids: Object.keys(ratings),
          show_ratings: Object.values(ratings),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      setRatings({});
      fetchRecommendations(); // Refresh recommendations after submission
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Something went wrong. Please try again!");
    }
  };

  return (
    <div className="min-h-screen mt-12 flex justify-center items-center bg-[#121212] text-gray-200 p-6">
      <div className="max-w-3xl mx-auto bg-[#272a30] shadow-lg p-8 rounded-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center uppercase">
          Your Recommendations
        </h1>
        {loading ? (
          <div className="flex flex-col space-y-2 items-center justify-center">
            <p className="text-lg">. . . are on their way</p>
            <Loader />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : recommendations.length > 0 ? (
          recommendations.map((anime, animeIndex) => (
            <div key={anime.unique_id} className="flex flex-row justify-between gap-4 py-4 border-b border-gray-600">
              <Link
                to={`/anime/details/${anime.unique_id}`}
                className="flex items-center gap-4 hover:bg-[#2a2a2a] transition duration-300"
                key={animeIndex}
                title={anime.name_english}
              >
                <img
                  src={anime.imagelink}
                  alt={anime.name}
                  className="h-14 w-14 rounded-lg object-cover bg-gray-700"
                />
                <div className="flex flex-col">
                  <span className="text font-semibold text-white">
                    {anime.name}
                  </span>
                  <span className="text-[0.65rem] text-gray-400 italic">
                    {anime.name_english}
                  </span>
                  <span className="text-xs text-slate-300 line-clamp-3">
                    <em className="font-medium text-slate-200"> Synopsis: </em> {anime.synopsis}
                  </span>

                </div>
              </Link>
              
              <div className="flex flex-col items-center justify-center min-w-24">
                <label htmlFor={`rating-${anime.unique_id}`} className="text-sm text-neutral-300 mb-1">
                  Rate (1-5)
                </label>
                <select
                  id={`rating-${anime.unique_id}`}
                  className="p-1 rounded bg-neutral-900 text-gray-200 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleRatingChange(anime.unique_id, Number(e.target.value))}
                  defaultValue="" // Ensures the user selects a value
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>


            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No recommendations available.</p>
        )}
        <button
          onClick={handleSubmit}
          className={`${loading ? "hidden" : "block"} w-full mt-4 bg-gray-700 hover:bg-neutral-900 duration-300 text-gray-100 font-semibold py-2 px-4 rounded`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Start;
