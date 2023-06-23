<template>
  <div class="city-detail-view">
    <h1>Détails météo pour la ville</h1>
    <WeatherDisplay :lat="lat" :lon="lon" />
    <SearchBar />
    <button @click="goBack">Retour</button>
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
    lat: Number,
    lon: Number
  },
  setup() {
    const router = useRouter();

    const goBack = () => {
      router.back();
    };

    return { goBack };
  }
});
</script>
