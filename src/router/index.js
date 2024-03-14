import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/modules/HomePage.vue'
import TicketsBooking from '@/modules/TicketsBooking.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/:filmName/:session',
      name: 'booking',
      component: TicketsBooking
    }
  ]
})

export default router
