<script setup>
  import {onMounted, ref} from 'vue'

  const userData = ref(null)

  onMounted(() => {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp
    userData.value = tg.initDataUnsafe?.user
    
  }
})


</script>

<template>
  
  <div class="main">Добро пожаловать, {{ userData.username }}</div>
  
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
</template>

<style scoped>

</style>
