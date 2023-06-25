import { defineStore } from 'pinia';

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
        addFavoriteCity(city: City) {
            const isCityInFavorites = this.favorites.some(
                favorite => favorite.name === city.name && favorite.lat === city.lat && favorite.lon === city.lon
            );

            if (!isCityInFavorites) {
                this.favorites.push(city);
            }
        },
        removeCityFromFavorites(cityName: string) {
            this.favorites = this.favorites.filter(city => city.name !== cityName);
        }
    },

    getters: {
        favoriteCities(): City[] {
            return this.favorites;
        },
    },
});
