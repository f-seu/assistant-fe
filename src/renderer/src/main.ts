import './assets/main.css'
import router from './routes/index'

import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'

const app= createApp(App)

//routes
app.use(router)
app.mount('#app')
