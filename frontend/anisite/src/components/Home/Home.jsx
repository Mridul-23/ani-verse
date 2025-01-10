import React from 'react'
import PFrame from './PFrame'
import Hcon from './Hcon'
import GenreSlider from './GenreSlider';
<<<<<<< HEAD
import useGenreLoader from '../../hooks/useGenreLoader';
=======

const genres = [
  {
    name: "Action",
    animeList: [
      {
        name_english: "Gintama. Slip Arc",
        ranked: 131,
        imagelink: "https://cdn.myanimelist.net/images/anime/11/88325.jpg",
        typeof: "TV",
        total_episodes: 13.0,
        genre: ["Action", "Comedy", "Seinen", "Sci-Fi", "Science Fiction", "Ecchi"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
    ],
  },
  {
    name: "Adventure",
    animeList: [
      {
        name_english: "Gintama. Slip Arc",
        ranked: 131,
        imagelink: "https://cdn.myanimelist.net/images/anime/11/88325.jpg",
        typeof: "TV",
        total_episodes: 13.0,
        genre: ["Action", "Comedy", "Seinen", "Sci-Fi", "Science Fiction", "Ecchi"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
    ],
  },
  {
    name: "Romance",
    animeList: [
      {
        name_english: "Gintama. Slip Arc",
        ranked: 131,
        imagelink: "https://cdn.myanimelist.net/images/anime/11/88325.jpg",
        typeof: "TV",
        total_episodes: 13.0,
        genre: ["Action", "Comedy", "Seinen", "Sci-Fi", "Science Fiction", "Ecchi"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
      {
        name_english: "Assassination Classroom Second Season",
        ranked: 149,
        imagelink: "https://cdn.myanimelist.net/images/anime/8/77966.jpg",
        typeof: "TV",
        total_episodes: 25.0,
        genre: ["Action", "Comedy", "School", "Slice of Life"],
      },
    ],
  },
];
>>>>>>> 1b7cc0b895b6ad351c87ff43246c8e297621b501

function Home() {
  const { genreAnimeList } = useGenreLoader([
    "action",
    "adventure",
    "fantasy",
    "romance",
  ]);

  return (
    <main className='mt-[3.75rem] flex flex-col items-center'>
      <PFrame 
        images={[
          {
            source: "https://images3.alphacoders.com/134/1342304.jpeg",
            content: "ONE PIECE"
          },
          {
            source: "https://images7.alphacoders.com/633/633122.png",
            content: "FATE SERIES"
          },
          {
            source: "https://wallpapers-clan.com/wp-content/uploads/2023/11/jojos-bizarre-adventure-jotaro-kujo-dark-desktop-wallpaper-preview.jpg",
            content: "JOJO'S BIZARRE ADVENTURE"
          },
          {
            source: "https://4kwallpapers.com/images/walls/thumbs_3t/19468.jpg",
            content: "DANDADAN"
          },
          {
            source: "https://images6.alphacoders.com/135/1358879.png",
            content: "OVERLORD"
          },
          {
            source: "https://wallpapercave.com/wp/wp12189706.jpg",
            content: "HAREM IN THE LABYRINTH OF ANOTHER WORLD"
          },
          {
            source: "https://rare-gallery.com/uploads/posts/553567-sword-art-online.jpg",
            content: "SWORD ART ONLINE"
          },
          {
            source: "https://images.alphacoders.com/136/1362052.png",
            content: "TENSURA"
          },
          {
            source: "https://images8.alphacoders.com/134/1349635.jpeg",
            content: "EMINENCE IN SHADOW"
          },
        ]}
      />

      <Hcon
      captions={"Welcome Senpai"} 
      gradient={{from: "#dc80f3", via: "#c500b8", to: "#ff4364"}}
      flex='flex-col gap-10'
      content='Aniverse is your ready to go All-in-One Anime Platform. Discover and Interact with the Anime Community. Get the latest updates on your favorite Anime Series and Movies.'
      content2='Explore the world of Anime with Aniverse'
      />

<<<<<<< HEAD
      <GenreSlider genres={genreAnimeList}/>
=======
      <GenreSlider genres={genres}/>
>>>>>>> 1b7cc0b895b6ad351c87ff43246c8e297621b501

    </main>
  )
}

export default Home;