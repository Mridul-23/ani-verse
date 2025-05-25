import { useEffect, useState } from "react";
import { searchAnime } from "../../utils/api";
import { Link } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";

function Search() {
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const debouncedSearch = useDebounce(search, 500);
  console.log(debouncedSearch);
  

  useEffect(() => {
    if (debouncedSearch.length === 0) {
      setResults([]);
      return;
    }

    const resultFetcher = async () => {
      setPending(true);
      setError(null);
      try {
        const animeData = await searchAnime(debouncedSearch);
        setResults(animeData);
      } catch (err) {
        setError("Failed to fetch anime details: " + err.message);
      } finally {
        setPending(false);
      }
    };

    resultFetcher();
  }, [debouncedSearch]);
  

return (
  <div className="min-h-screen pb-10 bg-gray-900 text-white overflow-x-hidden">
    <div className="flex flex-col items-center justify-start text-white px-4">
      <h1 className="text-3xl font-semibold mb-6 uppercase text-center mt-20">
        Search Anything Here
      </h1>
      <div className="w-full max-w-md flex flex-col">
        <label htmlFor="search-bar" className="text-sm mb-1 text-gray-400">
          Type here:
        </label>
        <input
          type="text"
          id="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type something..."
          autoComplete="off"
        />
      </div>
    </div>

    {pending && (
      <div className="m-5 text-center">
        <p>Loading...</p>
      </div>
    )}

    {error && (
      <div className="m-5 text-center text-red-500">
        <p>{error}</p>
      </div>
    )}

    <div className={`m-5 ${pending ? "hidden" : ""}`}>
      <h2 className="text-xl uppercase mb-5">Search Results</h2>
      {results.length === 0 ? (
        <p className="text-sm">No results found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-2">
          {results.map((anime, idx) => (
            <Link
              to={`/anime/details/${anime.unique_id}`}
              key={idx}
              title={anime.name_english}
              className="group"
            >
              <div className="w-full max-w-xs mx-auto aspect-[2/3] rounded-sm overflow-hidden shadow-md bg-gray-900 hover:shadow-lg transition-shadow relative">
                <img
                  src={anime.imagelink}
                  alt={anime.name_english}
                  className="w-full h-full object-cover scale-105 transition-transform"
                  draggable="false"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3">
                  <h4 className="font-semibold uppercase text-sm mb-1 text-white">
                    {anime.name_english}
                  </h4>
                  <p className="text-xs text-gray-200">
                    Ranked: <span className="font-semibold">{anime.ranked}</span>
                  </p>
                  <p className="text-xs text-gray-200">
                    Type: <span className="font-semibold">{anime.typeof}</span>
                  </p>
                  <p className="text-xs text-gray-200">
                    Episodes: <span className="font-semibold">{anime.total_episodes}</span>
                  </p>
                  <p className="text-xs text-gray-200 mt-1">
                    Genres:{" "}
                    {anime.genre.slice(0, 4).map((g, i) => (
                      <span key={i} className="font-semibold">{g}</span>
                    ))}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  </div>
);
}

export default Search;
