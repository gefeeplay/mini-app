<script setup>
import { onMounted, provide, ref, computed } from 'vue'
import Navigation from './components/Navigation.vue'
import LoginView from './components/LoginView.vue' // Импортируем компонент логина
import { provideTelegram } from './composables/useTelegram'
import { useUserStore } from './data/user'

provideTelegram()

const userData = ref(null)
const theme = ref('light')
const isAuthenticated = ref(false) // Флаг авторизации
const userStore = useUserStore()

provide('theme', { 
  theme, 
  setTheme: (newTheme) => { theme.value = newTheme } 
})

// Предоставляем функцию для установки авторизации
provide('setAuthenticated', (value) => {
  isAuthenticated.value = value
})

function checkAuth() {
  const refreshToken = userStore.getRefreshToken()
  const loginDate = localStorage.getItem('loginDate')

  if (refreshToken && loginDate) {
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
    const loginTime = parseInt(loginDate, 10)
    const now = Date.now()

    if (now - loginTime < sevenDaysMs) {
      return true
    }
  }
  return false
}

userStore.startAutoRefreshToken()

// Проверяем, есть ли токен при загрузке
onMounted(() => {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp
    userData.value = tg.initDataUnsafe?.user
    theme.value = window.Telegram.WebApp.colorScheme;
  }

  // Проверка токена + даты входа
  if (checkAuth()) {
    isAuthenticated.value = true
  }
})

// Вычисляемое свойство для отображения контента
const showAppContent = computed(() => isAuthenticated.value)
</script>

<template>
  <div v-if="showAppContent" class="app" :class="theme">
    <div class="main">
      <router-view></router-view>  
    </div>
    <Navigation :curTheme="theme"/>
  </div>
  
  <LoginView v-else />
</template>

<style scoped></style>