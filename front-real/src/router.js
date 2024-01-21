import { createRouter, createWebHistory } from 'vue-router'


const routes = [
//   {
//       path: '/',
//       name: 'Home',
//       component: () => import('./views/HomeView.vue'),
//       meta: { requiresAuth: false }
//   },
//   {
//       path: '/login',
//       name: 'Login',
//       component: () => import('./views/LoginView.vue'),
//       meta: { requiresAuth: false }
//   },
//   {
//       path: '/register',
//       name: 'Register',
//       component: () => import('./views/RegisterView.vue'),
//       meta: { requiresAuth: false }
//   },
//   {
//     path: '/dashboard',
//     name: 'Dashboard',
//     component: () => import('./views/DashboardView.vue'),
//     meta: { requiresAuth: true },
//   },
//   {
//     path: '/ai',
//     name: 'AI',
//     component: () => import('./views/AIView.vue'),
//     meta: { requiresAuth: true },
//   },
//   {
//     path: '/articles',
//     name: 'Articles',
//     component: () => import('./views/ArticlesView.vue'),
//     meta: { requiresAuth: true },
//   },
]

const router = createRouter({
	history: createWebHistory(),
	routes: routes,
})

export default router
