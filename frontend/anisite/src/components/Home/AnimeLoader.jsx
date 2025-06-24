import React from 'react';
import "./extra.css"

function AnimeLoader({ text = "Summoning data from the Anime Realm..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="loader-box"></div>
      <p className="mt-3 text-sm font-medium text-center loader-text">
        {text}
      </p>
    </div>
  );
}

export default AnimeLoader;
