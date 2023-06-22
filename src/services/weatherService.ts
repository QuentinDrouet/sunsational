import axios from 'axios';

const API_URL = 'https://weatherapi-com.p.rapidapi.com';
const RAPIDAPI_KEY = 'b4eea8d446mshc4f01aff16aa4a0p1c7187jsn3f4e64028ac2';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'Content-Type': 'application/json'
    }
});

export async function searchCities(query: string) {
    try {
        const response = await apiClient.get('/search.json', { params: { q: query } });
        return response.data;
    } catch (error) {
        console.error('An error occurred while searching for cities:', error);
        return [];
    }
}

export async function fetchWeatherData(lat: number, lon: number) {
    try {
        const response = await apiClient.get('/current.json', { params: { q: `${lat},${lon}` } });
        return response.data;
    } catch (error) {
        console.error('An error occurred while fetching weather data:', error);
        return null;
    }
}
