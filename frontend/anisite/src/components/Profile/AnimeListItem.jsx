import { Link } from 'react-router-dom';

function AnimeListItem({ anime }) {
  return (
    <Link
      to={`/anime/details/${anime.unique_id}`}
      className="
        w-full 
        shadow-lg 
        bg-slate-700 
        hover:bg-[#334155cb] 
        duration-200 
        flex flex-col sm:flex-row 
        items-start sm:items-center 
        rounded-lg 
        overflow-hidden
      "
    >
      {/* Image Container */}
      <div className="w-full sm:w-[20%] h-40 sm:h-[7.5rem]">
        <img
          src={anime.imagelink}
          alt={anime.name}
          className="
            w-full 
            h-full 
            object-cover 
            object-center 
            rounded-t-lg sm:rounded-t-none sm:rounded-l-lg
          "
        />
      </div>

      {/* Text & Metadata Container */}
      <div className="flex flex-col justify-between px-4 py-2 w-full sm:w-[80%]">
        {/* Title (truncate to one line) */}
        <h4
          className="text-lg font-semibold text-white overflow-hidden whitespace-nowrap truncate"
          title={anime.name}
        >
          {anime.name}
        </h4>

        {/* English Name (truncate to one line) */}
        <p
          className="text-xs text-gray-300 overflow-hidden whitespace-nowrap truncate"
          title={anime.name_english}
        >
          {anime.name_english}
        </p>

        {/* Genres (wrap onto multiple lines if needed) */}
        <div className="flex flex-wrap gap-2 mt-1">
          {anime.genre.slice(0, 3).map((genre, index) => (
            <span
              key={index}
              className="text-xs bg-gray-600 px-2 py-1 rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Episodes & Rank */}
        <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
          <span>{anime.total_episodes} Episodes</span>
          <span>Rank: {anime.ranked}</span>
        </div>
      </div>
    </Link>
  );
}

export default AnimeListItem;
