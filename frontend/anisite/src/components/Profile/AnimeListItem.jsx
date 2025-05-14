import { Link } from 'react-router-dom'


function AnimeListItem({ anime }) {
  return (

  <div className='bg-slate-700 rounded-lg shadow-lg'>
    <Link to={`/anime/details/${anime.unique_id}`} className='w-full h-[7.5rem] mt-4 bg-transparent hover:bg-[#00000011] duration-[250ms] flex items-center rounded-lg flex-wrap sm:flex-nowrap'>


      <div className='w-[30%] sm:w-[20%] h-full'>
        <img src={anime.imagelink} alt={anime.name} className='h-[100%] w-full object-cover object-center rounded-l-lg' />
      </div>
      <div className='flex flex-col justify-between px-4 py-2 w-[70%] sm:w-[80%]'>
        <h4 className='text-lg font-semibold text-ellipsis text-nowrap overflow-clip' title={anime.name}>{anime.name}</h4>
        <p className='text-xs text-gray-400 text-ellipsis text-nowrap overflow-clip'>{anime.name_english}</p>

        {/* Additional Info */}
        <div className='flex flex-wrap gap-2 mt-[0.35rem]'>
          {anime.genre.slice(0, 3).map((genre, index) => (
            <span key={index} className='text-xs bg-gray-600 px-2 py-1 rounded-full'>{genre}</span>
          ))}
        </div>

        <div className='flex justify-between items-center mt-2 text-sm text-gray-400'>
          <span>{anime.total_episodes} Episodes</span>
          <span>Rank: {anime.ranked}</span>
        </div>
      </div> 
    </Link>
  </div>
  );
}

export default AnimeListItem;
