<template>
  <ul>
    <li v-for="city in favoriteCities" :key="city.name">
      <span @click="goToCityDetail(city)">{{ city.name }}, {{ city.country}}</span>
      <button @click="removeCity(city.name)">Remove</button>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useWeatherStore } from '@/store/weatherStore';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const weatherStore = useWeatherStore();
    const router = useRouter();
    const favoriteCities = computed(() => weatherStore.favoriteCities);

    const removeCity = (cityName: string) => {
      weatherStore.removeCityFromFavorites(cityName);
    };

    const goToCityDetail = (city: { lat: number; lon: number }) => {
      router.push({
        name: 'CityDetail',
        params: { lat: city.lat, lon: city.lon },
      });
    };

    return { favoriteCities, removeCity, goToCityDetail };
  },
});
</script>
