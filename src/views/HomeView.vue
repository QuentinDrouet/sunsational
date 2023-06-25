<template>
  <img class="md:m-auto md:w-20" src="@/assets/logo-custom.png">
  <div class="home-view flex flex-col min-h-screen md:items-center ">
    <div class="w-full md:text-center md:w-fit">
      <h1 class="text-3xl mb-4 mt-12 md:mt-24">Make Every Day <span class="">Sunsational!</span></h1>
      <p class="mb-8">Try:
        <span @click="goToCityDetail(48.87, 2.33)" class="cursor-pointer hover:underline text-accent">Paris</span>,
        <span @click="goToCityDetail(51.52, -0.11)" class="cursor-pointer hover:underline text-accent">London</span>,
        <span @click="goToCityDetail(52.52, 13.4)" class="cursor-pointer hover:underline text-accent">Berlin</span>,
        <span @click="goToCityDetail(40.71, -74.01)" class="cursor-pointer hover:underline text-accent">New York</span>,
        <span @click="goToCityDetail(40.4, -3.68)" class="cursor-pointer hover:underline text-accent">Madrid</span>...
      </p>
      <div class="">
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

    const goToCityDetail = (lat: number, lon: number) => {
      router.push({
        name: 'CityDetail',
        params: { lat: lat, lon: lon }
      });
    };

    return { goToCityDetail };
  }
});
</script>