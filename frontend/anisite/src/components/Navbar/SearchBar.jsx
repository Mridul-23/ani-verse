import React, { useEffect, useState } from 'react'
import useDebounce from '../../hooks/useDebounce';
import { searchAnimeResults } from '../../utils/api';
import { Link } from 'react-router-dom';

const SearchBar = () => {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const [shown, setShown] = useState(false)
  const debouncedSearch = useDebounce(search, 500)
  
  useEffect(() => {
      if (debouncedSearch.length === 0) {
        setResults([]);
        return;
      }
  
      const resultFetcher = async () => {
        try {
          const animeData = await searchAnimeResults(debouncedSearch);
          setResults(animeData);
        } catch (err) {
          console.log("Failed to fetch anime details: " + err.message);
        }
      };
  
      resultFetcher();
    }, [debouncedSearch]);

  const handleLink = (anime) => () => {
    setShown(false)
    setSearch(anime.name)
  }

  return (
    <div className="relative flex flex-col items-center w-full">
    {/* Search Input */}
    <input
      type="text"
      id="search-bar"
      value={search}
      onChange={(e) => { 
        setSearch(e.target.value);
        setShown(true);
      }}
      className="w-96 p-2 text-sm rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md transition-all"
      placeholder="Search for your favorite anime..."
      autoComplete="off"
    />
    {/* Results Overlay */}
    <div
      className={`absolute top-full mt-2 w-96 rounded-b-xl bg-[#1f1f1f] shadow-xl border border-gray-700 overflow-x-hidden  max-h-[28rem] ${
        (search && shown) ? "" : "hidden"
      } z-50 overflow-scroll ${results.length>0 ? "search-scrollbar" : "scroll-none" } `}
    >
      <ul className="divide-y divide-gray-700">
        {results.length > 0 ? (
          results.map((anime, animeIndex) => (
            <li key={animeIndex}>
              <Link
                to={`/anime/details/${anime.unique_id}`}
                className="flex items-center gap-4 px-4 py-3 hover:bg-[#2a2a2a] transition duration-300"
                key={animeIndex}
                title={anime.name_english}
                onClick={handleLink(anime)}
              >
                <img
                  src={anime.imagelink}
                  alt={anime.name}
                  className="h-10 w-10 rounded-lg object-cover bg-gray-700"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">
                    {anime.name}
                  </span>
                  <span className="text-xs text-gray-400 italic">
                    {anime.name_english}
                  </span>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <li className="px-4 py-3 text-sm text-gray-400 italic">
            No results found.
          </li>
        )}
      </ul>
    </div>
  </div>

  )
}

export default SearchBar