import React, { useEffect, useState } from 'react';
import PFrame from './PFrame';
import Hcon from './Hcon';
import GenreSlider from './GenreSlider';
import useGenreLoader from '../../hooks/useGenreLoader';
import AnimeLoader from './AnimeLoader';

function Home() {
  const { genreAnimeList } = useGenreLoader([
    "action",
    "adventure",
    "fantasy",
    "romance",
  ]);

  const [backendCold, setBackendCold] = useState(true);

  useEffect(() => {
    if (genreAnimeList && genreAnimeList.length > 0) {
      setBackendCold(false);
    }
  }, [genreAnimeList]);

  return (
    <main className='mt-[3.25rem] min-[900px]:mt-[3.75rem] w-screen flex flex-col items-center'>
      <PFrame 
        images={[
          { source: "https://images3.alphacoders.com/134/1342304.jpeg", content: "ONE PIECE" },
          { source: "https://images7.alphacoders.com/633/633122.png", content: "FATE SERIES" },
          { source: "https://wallpapers-clan.com/wp-content/uploads/2023/11/jojos-bizarre-adventure-jotaro-kujo-dark-desktop-wallpaper-preview.jpg", content: "JOJO'S BIZARRE ADVENTURE" },
          { source: "https://4kwallpapers.com/images/walls/thumbs_3t/19468.jpg", content: "DANDADAN" },
          { source: "https://images6.alphacoders.com/135/1358879.png", content: "OVERLORD" },
          { source: "https://wallpapercave.com/wp/wp12189706.jpg", content: "HAREM IN THE LABYRINTH OF ANOTHER WORLD" },
          { source: "https://rare-gallery.com/uploads/posts/553567-sword-art-online.jpg", content: "SWORD ART ONLINE" },
          { source: "https://images.alphacoders.com/136/1362052.png", content: "TENSURA" },
          { source: "https://images2.alphacoders.com/133/1337180.png", content: "EMINENCE IN SHADOW" },
        ]}
      />

      <Hcon
        captions={"Welcome Senpai"} 
        gradient={{from: "#dc80f3", via: "#c500b8", to: "#ff4364"}}
        flex='flex-col gap-10'
        content='Aniverse is your ready to go All-in-One Anime Platform. Discover and Interact with the Anime Community. Get the latest updates on your favorite Anime Series and Movies.'
        content2='Explore the world of Anime with Aniverse'
      />

      {backendCold ? (
        <AnimeLoader />
      ) : (
        <GenreSlider genres={genreAnimeList} />
      )}
    </main>
  );
}

export default Home;
