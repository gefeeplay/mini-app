<script setup>
import { ref, onMounted } from 'vue'
import { useTelegram } from '../composables/useTelegram'

const { userData } = useTelegram()

const username = ref('')
onMounted(() => {
  const savedName = localStorage.getItem('username')
  if (savedName) {
    username.value = savedName
  }
})

</script>

<template>
    <div class="title">
      <div v-if="username">Добро пожаловать, {{ username }}</div>
      <div v-else>Добро пожаловать, пользователь</div>
    </div>
    <div>
        Лента
    </div>
</template>

<style scoped>
    
</style>