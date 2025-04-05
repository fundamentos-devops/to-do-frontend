import { createRouter } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '@/views/RegisterView.vue';
import Login from '@/views/LoginView.vue';
import { createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  { path: '/register', name: 'Register', component: Register },
  { path: '/login', name: 'Login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.name !== 'Login' && to.name !== 'Register' && !authStore.accessToken) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router
