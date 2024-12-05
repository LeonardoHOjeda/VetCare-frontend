import './assets/main.css'
// Vue
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// App
import App from './App.vue'
import router from './router'

/* Prime Vue */
import PrimeVue from 'primevue/config'
import Material from '@primevue/themes/material'

/* Toast */
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

/* Icons */
import { Icon } from '@iconify/vue'
import { ConfirmationService, ToastService } from 'primevue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, { position: POSITION.TOP_RIGHT })
app.component('Icon', Icon)
app.use(PrimeVue, {
  theme: {
    preset: Material,
    options: {
      darkModeSelector: 'false',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities'
      }
    }
  }
})
app.use(ConfirmationService)
app.use(ToastService, { position: POSITION.TOP_RIGHT })

app.mount('#app')
