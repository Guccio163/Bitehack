import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
      path: '/',
      name: 'Main',
      component: () => import('./components/MainView.vue'),
  },
  {
	path: '/stats',
	name: 'Statistics',
	component: () => import('./components/StartList.vue'),
  },
]

const router = createRouter({
	history: createWebHistory(),
	routes: routes,
})

export default router
