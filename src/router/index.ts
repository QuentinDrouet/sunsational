import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CityDetailView from '../views/CityDetailView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/city/:lat/:lon',
    name: 'CityDetail',
    component: CityDetailView,
    props: (route: { params: { lat: any; lon: any; }; }) => ({ lat: Number(route.params.lat), lon: Number(route.params.lon) })
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
