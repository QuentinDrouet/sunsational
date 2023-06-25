<template>
  <img class="md:m-auto md:w-20" src="@/assets/logo-custom.png">
  <div class="home-view flex flex-col min-h-screen md:items-center">
    <div class="w-full md:text-center md:w-fit">
      <h1 class="text-3xl mb-4 mt-12 md:mt-24">Make Every Day <span>Sunsational!</span></h1>
      <p class="mb-8">Try:
        <span v-for="(city, index) in recommendedCities" :key="index" @click="goToCityDetail(city.lat, city.lon)" class="cursor-pointer hover:underline text-accent">{{ city.name }}<span v-if="index < recommendedCities.length - 1">,</span></span>
      </p>
      <div>
        <SearchBar />
      </div>
    </div>
    <FavoritesList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SearchBar from '../components/SearchBar.vue';
import { useRouter } from 'vue-router';
import FavoritesList from '../components/FavoritesList.vue';

export default defineComponent({
  components: {
    SearchBar,
    FavoritesList
  },
  setup() {
    const router = useRouter();
    const recommendedCities = [
      { name: "Paris", lat: 48.87, lon: 2.33 },
      { name: " London", lat: 51.52, lon: -0.11 },
      { name: " Berlin", lat: 52.52, lon: 13.4 },
      { name: " New York", lat: 40.71, lon: -74.01 },
      { name: " Madrid", lat: 40.4, lon: -3.68 }
    ]

    const goToCityDetail = (lat: number, lon: number) => {
      router.push({
        name: 'CityDetail',
        params: { lat: lat, lon: lon }
      });
    };

    return { goToCityDetail, recommendedCities };
  }
});
</script>