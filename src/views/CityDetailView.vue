<template>
  <div class="city-detail-view">
    <h1>Détails météo pour la ville</h1>
    <WeatherDisplay :lat="lat" :lon="lon" />
    <button @click="goBack">Retour</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import WeatherDisplay from '../components/WeatherDisplay.vue';

export default defineComponent({
  components: {
    WeatherDisplay
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
