<template>
  <div class="city-detail-view">
    <div @click="goBack" class="flex items-center justify-start gap-2 cursor-pointer opacity-60 hover:opacity-100 transition-all w-fit mb-10">
      <i class="fa-solid fa-chevron-left"></i>
      <p>Retour</p>
    </div>
    <SearchBar />
    <WeatherDisplay :lat="lat" :lon="lon" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import WeatherDisplay from '../components/WeatherDisplay.vue';
import SearchBar from '../components/SearchBar.vue';

export default defineComponent({
  components: {
    WeatherDisplay,
    SearchBar
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
  setup() {
    const router = useRouter();

    const goBack = () => {
      router.push('/');
    };

    return { goBack };
  }
});
</script>