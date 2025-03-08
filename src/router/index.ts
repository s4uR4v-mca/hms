import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { RouteName } from './route-names'
import CliniciansView from '@/views/CliniciansView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteName.HOME,
      component: HomeView,
    },
    {
      path: '/clinicians',
      name: RouteName.CLINICIANS,
      component: CliniciansView,
    },
  ],
})

export default router
