import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp
  
  tg.expand()
  
  app.config.globalProperties.$tg = tg
}

app.mount('#app')