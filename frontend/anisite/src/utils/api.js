// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

export const getAnimeDetails = async (id) => {
  try {
    const response = await api.get(`/anime_details/?id=${id}`);
    return response.data[0];
  } catch (error) {
    throw new Error('Failed to fetch anime details: ' + error.message);
  }
};

export const searchAnime = async (str) => {
  try {
    const response = await api.get(`/search_anime/?anime_name=${str}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch anime details: ' + error.message);
  }
};
