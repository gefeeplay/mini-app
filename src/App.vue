<script setup>
import { onMounted, provide, ref } from 'vue'
import Navigation from './components/Navigation.vue'
import { provideTelegram } from './composables/useTelegram'
provideTelegram()

const userData = ref(null)
const theme = ref('dark')

provide('theme', theme);

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
    
    <router-view></router-view>  
  </div>


  <Navigation :curTheme="theme"/>
</div>  
</template>

<style scoped></style>
