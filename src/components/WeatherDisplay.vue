<template>
  <div v-if="weatherData">
    <div class="font-medium py-8 md:py-10 flex items-center justify-between md:justify-start md:gap-10 md:justify-center">
      <h1 class="text-3xl w-1/2 sm:text-4xl md:w-fit">{{ weatherData.location.name }}, <span class="opacity-70">{{ weatherData.location.country }}</span></h1>
      <div class="cursor-pointer text-accent text-xl sm:text-2xl">
        <i
            v-if="isCityInFavorites"
            class="fa-solid fa-heart"
            @click="removeFromFavorites"
        ></i>
        <i
            v-else
            class="fa-regular fa-heart"
            @click="addToFavorites"
        ></i>
      </div>
    </div>

    <div class="flex items-center justify-start md:justify-center bg-background gap-4 overflow-x-auto border-b border-gray-600 all -mr-6 hide-scrollbar">
      <div
          @click="selectDay(forecastDay.date)"
          v-for="(forecastDay, index) in weatherData.forecast.forecastday"
          :key="forecastDay.date"
          class="py-2 px-4 cursor-pointer whitespace-nowrap min-w-max"
          :class="isSelected(forecastDay.date) ? 'border-b-2 border-accent text-accent' : 'text-gray-500 hover:text-accent'"
      >
        <span>{{ index === 0 ? 'Today' : (index === 1 ? 'Tomorrow' : `+${index} days`) }}</span>
      </div>
    </div>

    <div v-if="selectedDayData">
      <div class="rounded-2xl">
        <div class="flex items-center justify-center gap-8 py-5">
          <img :src="getWeatherIcon(selectedDayData.day.condition.code)" alt="Weather icon" class="w-28 mt-5 md:w-36" />
          <div>
            <p class="text-5xl md:text-7xl">{{ Math.round(selectedDayData.day.maxtemp_c) }}°</p>
            <p class="text-4xl opacity-70 md:text-6xl">{{ Math.round(selectedDayData.day.mintemp_c) }}°</p>
          </div>
        </div>
        <div class="flex flex-col justify-center gap-4">
          <WeatherDetailCard
              iconClass="fa-solid fa-wind"
              label="Wind"
              :value="selectedDayData.day.maxwind_kph + 'km/h'"
          />
          <WeatherDetailCard
              iconClass="fa-solid fa-droplet"
              label="Humidity"
              :value="selectedDayData.day.avghumidity + '%'"
          />
          <WeatherDetailCard
              iconClass="fa-solid fa-umbrella"
              label="Chance of rain"
              :value="selectedDayData.day.daily_chance_of_rain + '%'"
          />
        </div>
      </div>

      <div class="flex items-center justify-start gap-6 md:gap-8 overflow-x-auto mt-12 -mr-6 hide-scrollbar md:justify-center">
        <div v-for="(hourData, index) in filteredHourData" :key="hourData.time" class="flex flex-col gap-2 text-center whitespace-nowrap min-w-max p-4 md:p-6 rounded-xl" :class="index === 0 ? 'bg-primary' : ''">
          <p class="uppercase opacity-80 text-sm" >{{ new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(hourData.time)) }}</p>
          <img class="mx-auto w-10 md:w-16" :src="getWeatherIcon(hourData.condition.code)" alt="Weather icon" />
          <p class="text-lg">{{ Math.round(hourData.temp_c) }}°C</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col items-center mt-10 gap-4">
    <div class="spinner"></div>
    <p>Fetching weather...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, computed } from 'vue';
import { fetchWeatherData } from '@/services/weatherService';
import { useWeatherStore } from '@/store/weatherStore';
import weatherIconMapping from '@/json/weather-codes.json';
import WeatherDetailCard from '@/components/WeatherDetailCard.vue';

// Define the structure of used objects
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
  components: {
    WeatherDetailCard
  },
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

    // Watch for changes in latitude and longitude, and fetch new weather data when they change
    watchEffect(async () => {
      if (props.lat && props.lon) {
        const data = await fetchWeatherData(props.lat, props.lon);
        weatherData.value = data;
        selectedDay.value = data?.forecast?.forecastday[0]?.date || null;
      }
    });

    // Watch for changes in selectedDay and update selectedDayData accordingly
    watchEffect(() => {
      if (selectedDay.value) {
        selectedDayData.value = weatherData.value?.forecast?.forecastday.find(
            (forecastDay: { date: string; }) => forecastDay.date === selectedDay.value
        ) || null;
      }
    });

    // Computed property for filtering hourly data for the selected day
    const filteredHourData = computed(() => {
      const now = new Date();
      return selectedDayData.value?.hour.filter((hourData: { time: string; }) => new Date(hourData.time) >= now) || [];
    });

    // Function to set the selected day
    const selectDay = (date: null) => {
      selectedDay.value = date;
    };

    // Function to check if a date is selected
    const isSelected = (date: null) => {
      return selectedDay.value === date;
    };

    // Computed property to check if the current city is in favorites
    const isCityInFavorites = computed(() => {
      return weatherStore.favoriteCities.some(city =>
          city.name === weatherData.value?.location.name &&
          city.lat === props.lat &&
          city.lon === props.lon
      );
    });

    // Function to add the current city to favorites
    const addToFavorites = () => {
      if (weatherData.value && weatherData.value.location) {
        weatherStore.addFavoriteCity(weatherData.value.location);
      }
    };

    // Function to remove the current city from favorites
    const removeFromFavorites = () => {
      if (weatherData.value && weatherData.value.location) {
        weatherStore.removeFavoriteCity(weatherData.value.location.name);
      }
    };

    // Function to get the custom weather icon based on the condition code (see weather-codes.json)
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
      getWeatherIcon,
      removeFromFavorites
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