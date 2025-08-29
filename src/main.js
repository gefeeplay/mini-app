import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import SettingsView from './components/SettingsView.vue'
import FeedView from './components/FeedView.vue'
import FriendsView from './components/FriendsView.vue'
import TrainingView from './components/TrainingView.vue'
import FindFriends from './components/FindFriends.vue'
import FriendsRequests from './components/FriendsRequests.vue'
import { createPinia } from 'pinia'

const app = createApp(App)

const pinia = createPinia()

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    name: 'Feed',
    path: '/',
    component: FeedView
  },{
    name: 'Training',
    path: '/training',
    component: TrainingView
  },{
    name: 'Friends',
    path: '/friends',
    component: FriendsView
  },{
    name: 'Find',
    path: '/friends/find', 
    component: FindFriends
  },{
    name: 'FriendsRequests',
    path: '/friends/requests', 
    component: FriendsRequests
  },{
    name: 'Settings',
    path: '/settings',
    component: SettingsView
  }]
})

if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp
  
  tg.expand()
  
  app.config.globalProperties.$tg = tg
}

app.use(router)
app.use(pinia)

app.mount('#app')