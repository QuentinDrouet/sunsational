<template>
  <div class="home-view">
    <h1>Recherche de météo</h1>
    <SearchBar />
    <FavoritesList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SearchBar from '../components/SearchBar.vue';
import FavoritesList from '../components/FavoritesList.vue';

export default defineComponent({
  components: {
    SearchBar,
    FavoritesList
  }
});
</script>