import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/lib/firebase'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/overlay/:userId',
      name: 'overlay',
      component: () => import('@/views/OverlayView.vue'),
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthPage = to.name === 'login' || to.name === 'register'
  const user = auth.currentUser

  if (requiresAuth && !user) {
    next({ name: 'login' })
  } else if (isAuthPage && user) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
