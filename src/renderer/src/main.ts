/*
  Copyright (c) 2024, Li Yaning,Zu Yuankun/Southeast University
  Licensed under the GPL3 License (see LICENSE file for details) 
*/

import './assets/main.css'
import router from './routes/index'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'element-plus/dist/index.css'

const app= createApp(App)
const pinia = createPinia()


import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
//routes
app.use(router)
app.use(pinia)
app.mount('#app')
