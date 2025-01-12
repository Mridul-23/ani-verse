import { useState, useEffect } from "react";
import axios from "axios";

const useGenreLoader = (genres) => {
  const [genreAnimeList, setGenreAnimeList] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {

      try {
        const requests = genres.map((genre) =>
          axios.get(`http://127.0.0.1:8000/anime_by_genre/?genre=${genre}`)
        );

        const responses = await Promise.all(requests);
        const data = responses.map((response, index) => ({
          name: genres[index],
          animeList: response.data,
        }));
        setGenreAnimeList(data);
      } catch (err) {
        console.error("Error fetching anime data:", err);
      }
    };

    fetchGenres();
  }, []);

  return { genreAnimeList};
};

export default useGenreLoader;
