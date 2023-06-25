<template>
  <div v-if="weatherData">
    <div class="text-3xl font-medium py-6">
      <h1>{{ weatherData.location.name }},</h1>
      <h2 class="opacity-70">{{ weatherData.location.country }}</h2>
    </div>

    <div class="flex items-center justify-start bg-background gap-4 overflow-x-auto border-b border-gray-600 all -mr-6 hide-scrollbar">
      <div
          @click="selectDay(forecastDay.date)"
          v-for="(forecastDay, index) in weatherData.forecast.forecastday"
          :key="forecastDay.date"
          class="py-2 px-4 cursor-pointer whitespace-nowrap min-w-max"
          :class="isSelected(forecastDay.date) ? 'border-b-2 border-accent text-accent' : 'text-gray-700 hover:text-accent'"
      >
        <span>{{ index === 0 ? 'Today' : (index === 1 ? 'Tomorrow' : `+${index} days`) }}</span>
      </div>
    </div>

    <div v-if="selectedDayData">
      <div class="rounded-2xl">
        <div class="flex items-center justify-between p-5">
          <img :src="getWeatherIcon(selectedDayData.day.condition.code)" alt="Weather icon" class="w-28 mt-5" />
          <div>
            <p class="text-5xl">{{ Math.round(selectedDayData.day.maxtemp_c) }}°</p>
            <p class="text-4xl opacity-70">{{ Math.round(selectedDayData.day.mintemp_c) }}°</p>
          </div>
        </div>
        <div class="flex flex-col justify-center gap-4">
          <div class="flex items-center justify-between bg-primary rounded-xl px-5 py-4">
            <div class="flex items-center gap-2 justify-start">
              <div class="relative bg-secondary rounded-lg w-10 h-10 flex items-center justify-center">
                <i class="fa-solid fa-wind text-lg text-purple-400"></i>
              </div>
              <p>Wind</p>
            </div>
            <p>{{ selectedDayData.day.maxwind_kph }}km/h</p>
          </div>
          <div class="flex items-center justify-between bg-primary rounded-xl px-5 py-4">
            <div class="flex items-center gap-2 justify-start">
              <div class="relative bg-secondary rounded-lg w-10 h-10 flex items-center justify-center">
                <i class="fa-solid fa-droplet text-lg text-purple-400"></i>
              </div>
              <p>Humidity</p>
            </div>
            <p>{{ selectedDayData.day.avghumidity }}%</p>
          </div>
          <div class="flex items-center justify-between bg-primary rounded-xl px-5 py-4">
            <div class="flex items-center gap-2 justify-start">
              <div class="relative bg-secondary rounded-lg w-10 h-10 flex items-center justify-center">
                <i class="fa-solid fa-umbrella text-lg text-purple-400"></i>
              </div>
              <p>Chance of rain</p>
            </div>
            <p>{{ selectedDayData.day.daily_chance_of_rain }}%</p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-start gap-6 overflow-x-auto mt-12 -mr-6 hide-scrollbar">
        <div v-for="(hourData, index) in filteredHourData" :key="hourData.time" class="flex flex-col gap-2 text-center whitespace-nowrap min-w-max p-4 rounded-xl" :class="index === 0 ? 'bg-primary' : ''">
          <p class="uppercase opacity-80 text-sm" >{{ new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(hourData.time)) }}</p>
          <img class="mx-auto w-10" :src="getWeatherIcon(hourData.condition.code)" alt="Weather icon" />
          <p class="text-lg">{{ Math.round(hourData.temp_c) }}°C</p>
        </div>
      </div>
    </div>
    <button v-if="!isCityInFavorites" @click="addToFavorites" class="mt-24">Ajouter aux favoris</button>
  </div>
  <div v-else>
    <p>Loading weather data...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, computed } from 'vue';
import { fetchWeatherData } from '@/services/weatherService';
import { useWeatherStore } from '@/store/weatherStore';
import weatherIconMapping from '@/json/weather-codes.json';

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

interface HourData {
  time: string;
  condition: WeatherCondition;
  temp_c: number;
  wind_kph: number;
}

interface ForecastDay {
  date: string;
  day: {
    condition: WeatherCondition;
    maxtemp_c: number;
    mintemp_c: number;
    avghumidity: number;
    maxwind_kph: number;
    daily_chance_of_rain: number;
  };
  hour: HourData[];
}

interface WeatherForecast {
  forecastday: ForecastDay[];
}

interface WeatherData {
  location: WeatherLocation;
  forecast: WeatherForecast;
}

export default defineComponent({
  props: {
    lat: {
      type: Number,
      required: true
    },
    lon: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const weatherData = ref<WeatherData | null>(null);
    const selectedDay = ref<string | null>(null);
    const selectedDayData = ref<ForecastDay | null>(null);
    const weatherStore = useWeatherStore();


    watchEffect(async () => {
      if (props.lat && props.lon) {
        const data = await fetchWeatherData(props.lat, props.lon);
        weatherData.value = data;
        selectedDay.value = data?.forecast?.forecastday[0]?.date || null;
      }
    });

    watchEffect(() => {
      if (selectedDay.value) {
        selectedDayData.value = weatherData.value?.forecast?.forecastday.find(
            (forecastDay: { date: string; }) => forecastDay.date === selectedDay.value
        ) || null;
      }
    });

    const filteredHourData = computed(() => {
      const now = new Date();
      return selectedDayData.value?.hour.filter((hourData: { time: string; }) => new Date(hourData.time) >= now) || [];
    });

    const selectDay = (date: null) => {
      selectedDay.value = date;
    };

    const isSelected = (date: null) => {
      return selectedDay.value === date;
    };

    const isCityInFavorites = computed(() => {
      return weatherStore.favoriteCities.some(city =>
          city.name === weatherData.value?.location.name &&
          city.lat === props.lat &&
          city.lon === props.lon
      );
    });

    const addToFavorites = () => {
      if (weatherData.value && weatherData.value.location) {
        weatherStore.addFavoriteCity(weatherData.value.location);
      }
    };

    const getWeatherIcon = (conditionCode: number) => {
      const iconMap = weatherIconMapping.find(mapping => mapping.codes.includes(conditionCode));
      const icon = iconMap ? iconMap.icon : 'default';
      return require(`@/assets/weather-icons/${icon}.png`);
    };

    return {
      weatherData,
      selectedDayData,
      selectDay,
      isSelected,
      filteredHourData,
      addToFavorites,
      isCityInFavorites,
      getWeatherIcon
    };
  }
});
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>