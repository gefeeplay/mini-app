import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'

const app = createApp(App)

const pinia = createPinia()

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    name: 'Feed',
    path: '/',
    component: () => import('./components/FeedView.vue')
  },{
    name: 'Training',
    path: '/training',
    component: () => import('./components/TrainingView.vue')
  },{
    name: 'Friends',
    path: '/friends',
    component: () => import('./components/FriendsView.vue')
  },{
    name: 'Find',
    path: '/friends/find', 
    component: () => import('./components/FindFriends.vue')
  },{
    name: 'FriendsRequests',
    path: '/friends/requests', 
    component: () => import('./components/FriendsRequests.vue')
  },{
    name: 'Settings',
    path: '/settings',
    component: () => import('./components/SettingsView.vue')
  }]
})

if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp
  
  // Обязательно вызвать ready()
  tg.ready()

  // Расширяет WebView — исправляет фокус инпутов
  tg.expand()
  
  // Делаем доступным в приложении как this.$tg
  app.config.globalProperties.$tg = tg
}

app.use(router)
app.use(pinia)

app.mount('#app')