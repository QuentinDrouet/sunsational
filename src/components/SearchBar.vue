<template>
  <div class="relative w-full" ref="searchWrapper">
    <div class="flex items-center gap-2 border border-gray-500 py-2 p-4 rounded-full">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input
          v-model="query"
          @input="search"
          @focus="listVisible = true"
          placeholder="Search a city..."
          class="outline-0 bg-transparent w-full"
      />
    </div>
    <div
        v-if="listVisible"
        class="absolute bg-primary z-10 w-full top-12 rounded-xl overflow-hidden"
    >
      <ul v-if="cities.length > 0">
        <li
            class="hover:bg-secondary cursor-pointer py-3 px-5"
            v-for="city in cities"
            :key="city.id"
            @click="goToCityDetail(city)"
        >
          {{ city.name }}, {{ city.country }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { searchCities } from '@/services/weatherService';

export default defineComponent({
  setup() {
    const searchWrapper = ref<HTMLElement | null>(null);
    const query = ref('');
    const router = useRouter();
    const cities = ref([]);
    const route = useRoute();
    const listVisible = ref(false);

    const search = async () => {
      if (query.value.trim()) {
        cities.value = await searchCities(query.value);
      } else {
        cities.value = [];
      }
    };

    const goToCityDetail = (city: any) => {
      router.push({
        name: 'CityDetail',
        params: { lat: city.lat, lon: city.lon }
      });
      listVisible.value = false;
    };

    const handleClickOutside = (e: Event) => {
      if (searchWrapper.value && !searchWrapper.value.contains(e.target as Node)) {
        listVisible.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    watch(route, () => {
      query.value = '';
      cities.value = [];
    });

    return { query, cities, search, goToCityDetail, searchWrapper, listVisible };
  }
});

</script>

