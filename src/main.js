import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// Fuente Montserrat
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/700.css'

// Iconos Phosphor (ejemplo de uso global)
import { PhHouse, PhMapPin, PhUser } from '@phosphor-icons/vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// Registro global de algunos iconos
app.component('PhHouse', PhHouse)
app.component('PhMapPin', PhMapPin)
app.component('PhUser', PhUser)

app.mount('#app')
