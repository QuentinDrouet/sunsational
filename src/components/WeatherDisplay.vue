<template>
  <div v-if="weatherData" class="weather-display">
    <div v-if="weatherData.forecast" class="forecast">
      <h3 class="">Prévisions météo:</h3>
      <div v-for="forecastDay in weatherData.forecast.forecastday" :key="forecastDay.date" class="forecast-day">
        <h4>{{ forecastDay.date }}</h4>
        <p>{{ forecastDay.day.condition.text }}</p>
        <img :src="forecastDay.day.condition.icon" alt="Weather icon">
        <p>Température maximale: {{ forecastDay.day.maxtemp_c }}°C</p>
        <p>Température minimale: {{ forecastDay.day.mintemp_c }}°C</p>
      </div>
    </div>

    <button v-if="!isCityInFavorites" @click="addToFavorites">Ajouter aux favoris</button>
  </div>
  <div v-else>
    <p>Chargement des données météorologiques...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue';
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

    const fetchWeather = async (lat: number, lon: number) => {
      weatherData.value = await fetchWeatherData(lat, lon);
    };

    onMounted(() => {
      fetchWeather(props.lat, props.lon);
    });

    watch(() => [props.lat, props.lon], ([newLat, newLon]) => {
      fetchWeather(newLat, newLon);
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

