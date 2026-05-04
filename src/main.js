import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/main.css'

// Routes
const routes = [
  {
    path: '/',
    component: () => import('./views/DisplayView.vue'),
    meta: { title: 'Jam Masjid Digital' }
  },
  {
    path: '/admin',
    component: () => import('./views/AdminView.vue'),
    meta: { title: 'Admin Panel - Jam Masjid Digital' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to) => {
  document.title = to.meta.title || 'Jam Masjid Digital'
})

const app = createApp(App)
app.use(router)
app.mount('#app')
