import React from "react";
import "./extra.css";
import { Link } from "react-router-dom";

const GenreSlider = ({
  genres,
  heading = "Explore by Genre",
  head_size = "4",
  styles = "w-screen from-[#0f0f0f] to-[#1f1f1f]",
}) => {
  return (
    <section className={`py-10 px-5 ${styles} bg-gradient-to-b`}>
      <h2
        className={`text-left text-blue-400 font-bold uppercase ml-2 text-${head_size}xl mb-8`}
      >
        {heading}
      </h2>
      {genres.map((genre, index) => (
        <div className="mb-8 ml-6" key={index}>
          <h3 className="text-blue-400 text-xl uppercase mb-4">{genre.name}</h3>
          <div className="flex overflow-x-auto gap-5 pb-3 scroll-smooth custom-scrollbar">
            {genre.animeList.map((anime, animeIndex) => (
              <Link
                to={`/anime/details/${anime.unique_id}`}
                className="relative group"
                key={animeIndex}
                title={anime.name_english}
              >
                <div className="flex-none rounded-sm w-52 h-80 overflow-hidden shadow-md bg-gray-900 hover:shadow-lg transition-shadow">
                  <img
                    src={anime.imagelink}
                    alt={anime.name_english}
                    className="w-full h-full overlay-1 object-cover scale-105 transition-transform"
                    draggable="false"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity overlay-hover duration-500">
                    <div className="absolute bottom-3 left-3 text-white text-xs">
                      <h4 className="font-semibold uppercase text-sm mb-2">
                        {anime.name_english}
                      </h4>
                      <p>
                        Ranked:{" "}
                        <span className="font-semibold">{anime.ranked}</span>
                      </p>
                      <p>
                        Type:{" "}
                        <span className="font-semibold">{anime.typeof}</span>
                      </p>
                      <p>
                        Episodes:{" "}
                        <span className="font-semibold">
                          {anime.total_episodes}
                        </span>
                      </p>
                      <span className="mt-1">Genres: </span>
                      <span>
                        {anime.genre.slice(0, 4).map((g, idx) => (
                          <span key={idx}>
                            <b>{g} </b>
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default GenreSlider;
