<template>
  <div>
    <input v-model="query" @input="search" placeholder="Rechercher une ville...">
    <ul v-if="cities.length > 0">
      <li v-for="city in cities" :key="city.id" @click="goToCityDetail(city)">
        {{ city.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { searchCities } from '@/services/weatherService';

export default defineComponent({
  setup() {
    const query = ref('');
    const router = useRouter();
    const cities = ref([]);

    const search = async () => {
      cities.value = await searchCities(query.value);
    };

    const goToCityDetail = (city: any) => {
      // Assure-toi que les données de la ville contiennent la latitude et la longitude
      router.push({
        name: 'CityDetail',
        params: { lat: city.lat, lon: city.lon }
      });
    };

    return { query, cities, search, goToCityDetail };
  }
});
</script>

