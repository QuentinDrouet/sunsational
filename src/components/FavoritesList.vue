<template>
  <div class="mt-24 w-full">
    <h2 class="mb-6 text-lg">My favorite cities</h2>
    <div v-if="favoriteCitiesWithData.length > 0">
      <ul class="flex flex-col justify-center gap-4">
        <li v-for="city in favoriteCitiesWithData" :key="city.name" class="flex items-center justify-between bg-primary rounded-xl px-5 py-4">
          <div class="flex items-center gap-2 justify-start">
            <div class="relative bg-secondary rounded-lg w-10 h-10 flex items-center justify-center">
              <img :src="city.weatherIcon" alt="Weather Icon" class="w-6 h-6" />
            </div>
            <span @click="goToCityDetail(city)">{{ city.name }}, {{ city.country}}</span>
          </div>
          <span>{{ Math.round(city.temperature) }}°</span>
        </li>
      </ul>
    </div>
    <img v-else src="../assets/undraw_small_town_re_7mcn.svg" alt="No favorite cities" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue';
import { useWeatherStore } from '@/store/weatherStore';
import { useRouter } from 'vue-router';
import { fetchRealtimeWeatherData } from '@/services/weatherService';
import { City } from '@/store/weatherStore';

interface CityWeatherData extends City {
  weatherIcon: string;
  temperature: number;
}

export default defineComponent({
  setup() {
    const weatherStore = useWeatherStore();
    const router = useRouter();
    const favoriteCities = computed(() => weatherStore.favoriteCities);
    const favoriteCitiesWithData = ref<CityWeatherData[]>([]);

    onMounted(async () => {
      // Fetch weather data for each favorite city
      const citiesWithData = [];
      for (let city of favoriteCities.value) {
        const weatherData = await fetchRealtimeWeatherData(city.lat, city.lon);
        if (weatherData) {
          citiesWithData.push({
            ...city,
            weatherIcon: weatherData.current.condition.icon,
            temperature: weatherData.current.temp_c
          });
        }
      }
      favoriteCitiesWithData.value = citiesWithData;
    });

    const goToCityDetail = (city: { lat: number; lon: number }) => {
      router.push({
        name: 'CityDetail',
        params: { lat: city.lat, lon: city.lon },
      });
    };

    return { favoriteCitiesWithData, goToCityDetail };
  },
});
</script>
