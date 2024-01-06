/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp, markRaw } from 'vue'

import { createPinia } from 'pinia'
import router from '@router/router'
import 'reflect-metadata';

const app = createApp(App)
const pinia = createPinia()
pinia.use(({ store }) => { store.router = markRaw(router) })

registerPlugins(app)

app.use(router)
app.use(pinia)

app.mount('#app')
