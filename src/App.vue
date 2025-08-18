<script setup>
import { onMounted, ref } from 'vue'

const userData = ref(null)
const theme = ref('dark')

onMounted(() => {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp
    userData.value = tg.initDataUnsafe?.user
    theme.value = window.Telegram.WebApp.colorScheme;
  }
})


</script>

<template>
<div class="app" :class="theme">
  <div class="main">
    <div class="hello">
      <div v-if="userData">Добро пожаловать, {{ userData.username }}</div>
      <div v-else="userData">Добро пожаловать, пользователь</div>
    </div>
  </div>


  <div class="navigation">
    <button class="nav-item">
      <span class="material-symbols-outlined">
        menu
      </span>Лента
    </button>
    <button class="nav-item">
      <span class="material-symbols-outlined">
        directions_run
      </span>
      Тренировки
    </button>
    <button class="nav-item">
      <span class="material-symbols-outlined">
        chat
      </span>
      Друзья
    </button>
    <button class="nav-item">
      <span class="material-symbols-outlined">
        settings
      </span>
      Настройки
    </button>
  </div>
</div>  
</template>

<style scoped></style>
