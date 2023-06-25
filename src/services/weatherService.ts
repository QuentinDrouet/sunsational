import axios from 'axios';

const API_URL = 'https://weatherapi-com.p.rapidapi.com';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'X-RapidAPI-Key': process.env.VUE_APP_RAPIDAPI_KEY,
        'Content-Type': 'application/json'
    }
});

// Search endpoint returns matching cities and towns
export async function searchCities(query: string) {
    try {
        const response = await apiClient.get('/search.json', { params: { q: query } });
        return response.data;
    } catch (error) {
        console.error('An error occurred while searching for cities:', error);
        return [];
    }
}

// Forecast endpoint returns weather forecast for the next q days
export async function fetchWeatherData(lat: number, lon: number) {
    try {
        const response = await apiClient.get('/forecast.json', { params: { q: `${lat},${lon}`, days: '3' } });
        return response.data;
    } catch (error) {
        console.error('An error occurred while fetching weather data:', error);
        return null;
    }
}

// Current endpoint returns current weather data
export async function fetchRealtimeWeatherData(lat: number, lon: number) {
    try {
        const response = await apiClient.get('/current.json', { params: { q: `${lat},${lon}` } });
        return response.data;
    } catch (error) {
        console.error('An error occurred while fetching weather data:', error);
        return null;
    }
}