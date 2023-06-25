<template>
  <div class="mt-24 w-full md:flex md:flex-col md:items-center">
    <h2 class="mb-6 text-lg md:text-xl">My favorite cities <i class="fa-solid fa-heart text-accent"></i></h2>

    <div v-if="isLoading" class="flex justify-center">
      <div class="spinner"></div>
    </div>

    <div v-else-if="favoriteCitiesWithData.length > 0">
      <ul class="flex flex-col justify-center gap-4">
        <li @click="goToCityDetail(city)" v-for="city in favoriteCitiesWithData" :key="city.name" class="md:w-96 flex items-center justify-between bg-primary rounded-xl px-5 py-4 cursor-pointer hover:opacity-90">
          <div class="flex items-center gap-2 justify-start">
            <div class="relative bg-secondary rounded-lg w-10 h-10 flex items-center justify-center">
              <img :src="city.weatherIcon" alt="Weather Icon" class="w-8 h-8" />
            </div>
            <span>{{ truncateText(city.name + ', ' + city.country, 20) }}</span>
          </div>
          <span>{{ Math.round(city.temperature) }}°</span>
        </li>
      </ul>
    </div>

    <div v-else>
      <img src="../assets/undraw_small_town_re_7mcn.svg" alt="No favorite cities" class="w-56" />
      <p class="mt-4 opacity-80"><i>You don't have favorite cities yet</i></p>
    </div>
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
    const isLoading = ref(true);

    // Fetch weather data for each favorite city
    onMounted(async () => {
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
      isLoading.value = false;
    });

    // Navigate to the detail page of the selected city
    const goToCityDetail = (city: { lat: number; lon: number }) => {
      router.push({
        name: 'CityDetail',
        params: { lat: city.lat, lon: city.lon },
      });
    };

    // Truncate the text of the city name and country
    const truncateText = (text: string, maxLength: number) => {
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    return { favoriteCitiesWithData, goToCityDetail, isLoading, truncateText };
  },
});
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #000;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
