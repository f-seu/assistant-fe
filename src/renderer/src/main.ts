import './assets/main.css'
import router from './routes/index'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'element-plus/dist/index.css'

const app= createApp(App)
const pinia = createPinia()

//routes
app.use(router)
app.use(pinia)
app.mount('#app')
