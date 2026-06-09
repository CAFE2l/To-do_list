import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/lib/firebase'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/site/HomePage.vue'),
    },
    {
      path: '/overlays',
      name: 'overlays',
      component: () => import('@/views/site/OverlaysPage.vue'),
    },
    {
      path: '/overlays/:id',
      name: 'overlay-detail',
      component: () => import('@/views/site/OverlayDetailPage.vue'),
    },
    {
      path: '/how-to-use',
      name: 'how-to-use',
      component: () => import('@/views/site/HowToUsePage.vue'),
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('@/views/site/PricingPage.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/site/AboutPage.vue'),
    },
    {
      path: '/customize',
      name: 'customize',
      component: () => import('@/views/site/CustomizePage.vue'),
    },
    {
      path: '/overlay-mode/:id',
      name: 'overlay-mode',
      component: () => import('@/views/site/OverlayModePage.vue'),
      meta: { obsMode: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { legacy: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { legacy: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true, legacy: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true, legacy: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true, legacy: true },
    },
    {
      path: '/overlay/:userId',
      name: 'overlay',
      component: () => import('@/views/OverlayView.vue'),
      meta: { obsMode: true, legacy: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/site/NotFoundPage.vue'),
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
