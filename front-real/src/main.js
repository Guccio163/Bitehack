import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

import PrimeVue from 'primevue/config'

import { createPinia } from 'pinia'

// primevue
import './assets/main.css'
import 'primeflex/primeflex.css'
import 'primevue/resources/themes/lara-light-green/theme.css'
import 'primeicons/primeicons.css';

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8000/api'
axios.defaults.headers.common["Authorization"] = `Token e31909e316ed96c159b39668941662bdc9d31786`;

createApp(App)
.use(router)
.use(PrimeVue)
.use(createPinia())
.mount('#app')