<template>
  <div class="city-detail-view">
    <SearchBar />
    <WeatherDisplay :lat="lat" :lon="lon" />
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