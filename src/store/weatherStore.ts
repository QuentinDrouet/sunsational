import { defineStore } from 'pinia';

// Define the structure of a City object
export interface City {
    name: string;
    country: string;
    lat: number;
    lon: number;
}

export const useWeatherStore = defineStore('weather', {
    state: () => ({
        favorites: [] as City[],
    }),

    actions: {
        // Add a city to the list of favorite cities
        addFavoriteCity(city: City) {
            // Check if the city is already in the favorites
            const isCityInFavorites = this.favorites.some(
                favorite => favorite.name === city.name && favorite.lat === city.lat && favorite.lon === city.lon
            );
            // Add the city if it is not already in favorites
            if (!isCityInFavorites) {
                this.favorites.push(city);
            }
        },
        // Remove a city from the list of favorite cities by its name
        removeFavoriteCity(cityName: string) {
            this.favorites = this.favorites.filter(city => city.name !== cityName);
        }
    },

    getters: {
        favoriteCities(): City[] {
            return this.favorites;
        },
    },
});
