import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp
  
  // Развернуть приложение на весь экран (опционально)
  tg.expand()
  
  // Передаём Telegram WebApp в глобальные свойства Vue
  app.config.globalProperties.$tg = tg
}

app.mount('#app')