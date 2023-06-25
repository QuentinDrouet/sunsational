<template>
  <div class="mt-24 w-full">
    <h2 class="mb-6 text-lg">My favorite cities</h2>

    <div v-if="isLoading" class="flex justify-center">
      <div class="spinner"></div>
    </div>

    <div v-else-if="favoriteCitiesWithData.length > 0">
      <ul class="flex flex-col justify-center gap-4">
        <li @click="goToCityDetail(city)" v-for="city in favoriteCitiesWithData" :key="city.name" class="flex items-center justify-between bg-primary rounded-xl px-5 py-4 cursor-pointer hover:opacity-90">
          <div class="flex items-center gap-2 justify-start">
            <div class="relative bg-secondary rounded-lg w-10 h-10 flex items-center justify-center">
              <img :src="city.weatherIcon" alt="Weather Icon" class="w-8 h-8" />
            </div>
            <span>{{ city.name }}, {{ city.country}}</span>
          </div>
          <span>{{ Math.round(city.temperature) }}°</span>
        </li>
      </ul>
    </div>

    <img v-else src="../assets/undraw_small_town_re_7mcn.svg" alt="No favorite cities" class="w-56" />
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

    const goToCityDetail = (city: { lat: number; lon: number }) => {
      router.push({
        name: 'CityDetail',
        params: { lat: city.lat, lon: city.lon },
      });
    };

    return { favoriteCitiesWithData, goToCityDetail, isLoading };
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
