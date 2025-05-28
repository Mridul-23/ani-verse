// api.js
import axios from 'axios';
import BASE_URL from '../../config';

const api = axios.create({
  baseURL: BASE_URL,
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
    const response = await api.get(`/explore_search/?anime_name=${str}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch anime details: ' + error.message);
  }
};

export const searchAnimeResults = async (str) => {
  try {
    const response = await api.get(`/search_anime/?anime_name=${str}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch anime details: ' + error.message);
  }
};

export const animeSimpleRecommendation = async (id) => {
  try {
    const response = await api.get(`recommendations/simple_recommendations/?id=${id}`);
    return response.data;
  }
  catch (error) {
    throw new Error('Failed to fetch custom recommendations with error: ' + error.message)
  }
}