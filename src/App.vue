<script setup>
import { onMounted, provide, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Navigation from './components/Navigation.vue'
import LoginView from './components/LoginView.vue' // Импортируем компонент логина
import { provideTelegram } from './composables/useTelegram'

provideTelegram()

const userData = ref(null)
const theme = ref('light')
const isAuthenticated = ref(false) // Флаг авторизации
const router = useRouter()

provide('theme', { 
  theme, 
  setTheme: (newTheme) => { theme.value = newTheme } 
})

// Предоставляем функцию для установки авторизации
provide('setAuthenticated', (value) => {
  isAuthenticated.value = value
  if (value) {
    router.push('/') // Перенаправляем на главную после авторизации
  }
})

// Проверяем, есть ли токен при загрузке
onMounted(() => {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp
    userData.value = tg.initDataUnsafe?.user
    theme.value = window.Telegram.WebApp.colorScheme;
  }
  
  // Проверяем наличие токена в localStorage
  const token = localStorage.getItem('token')
  if (token) {
    isAuthenticated.value = true
  }
})

// Вычисляемое свойство для отображения контента
const showAppContent = computed(() => {
  return isAuthenticated.value
})
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