<template>
  <div v-if="weatherData" class="weather-display">
    <h2>{{ weatherData.location.name }}, {{ weatherData.location.country }}</h2>
    <p>{{ weatherData.current.condition.text }}</p>
    <img :src="weatherData.current.condition.icon" alt="Weather icon">
    <p>Température : {{ weatherData.current.temp_c }}°C</p>
    <p>Humidité : {{ weatherData.current.humidity }}%</p>
    <p>Vitesse du vent : {{ weatherData.current.wind_kph }} kph</p>
    <button v-if="!isCityInFavorites" @click="addToFavorites">Ajouter aux favoris</button>
  </div>
  <div v-else>
    <p>Chargement des données météorologiques...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { fetchWeatherData } from '@/services/weatherService';
import { useWeatherStore } from '@/store/weatherStore';

interface WeatherLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface WeatherCondition {
  text: string;
  icon: string;
}

interface WeatherData {
  location: WeatherLocation;
  current: {
    condition: WeatherCondition;
    temp_c: number;
    humidity: number;
    wind_kph: number;
  };
}

export default defineComponent({
  props: {
    lat: {
      type: Number,
      required: true as const
    },
    lon: {
      type: Number,
      required: true as const
    }
  },
  setup(props) {
    const weatherData = ref<WeatherData | null>(null);
    const weatherStore = useWeatherStore();

    const isCityInFavorites = computed(() => {
      return weatherStore.favoriteCities.some(city =>
          city.name === weatherData.value?.location.name &&
          city.lat === props.lat &&
          city.lon === props.lon
      );
    });

    onMounted(async () => {
      weatherData.value = await fetchWeatherData(props.lat, props.lon);
    });

    const addToFavorites = () => {
      if (weatherData.value && weatherData.value.location) {
        weatherStore.addFavoriteCity(weatherData.value.location);
      }
    };

    return { weatherData, addToFavorites, isCityInFavorites };
  }
});
</script>
