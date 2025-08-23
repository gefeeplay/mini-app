<script setup>
import { ref, onMounted } from 'vue'
import { tgLogin } from '../api/auth.js'
import { useUserStore } from '../data/user.js'
import { useTelegram } from '../composables/useTelegram.js'

const userStore = useUserStore()
const { userData, initDataRaw } = useTelegram()

onMounted(() => {
  if (userData.value && userData.value.id) {
    tgLoginValue.value = userData.value.id
  }
})

async function login() {
  try {
    // Проверяем, что у нас есть ID для авторизации
    if (!initDataRaw) {
      alert('Не удалось получить данные пользователя Telegram')
      return
    }

    const data = await tgLogin(initDataRaw)
    /*console.log('Ответ сервера:', data)*/

    // Всплывающее окно с ответом сервера
    if (data.message) {
      alert(data.message)
    } else {
      alert('Авторизация прошла успешно!')
    }

    // Сохраняем данные пользователя
    if (data.username) {
      userStore.setUsername(data.username)
    }

    if (data.token) {
      localStorage.setItem('token', data.token)
    }

  } catch (e) {
    console.error('Полная ошибка авторизации:', e)
    
    if (e.response?.status === 401) {
      alert('Ошибка доступа: Неверный API ключ или настройки сервера')
    } else if (e.code === 'NETWORK_ERROR') {
      alert('Проблемы с сетью. Проверьте подключение к интернету')
    } else {
      alert('Ошибка авторизации: ' + (e.response?.data?.detail || e.message))
    }
  }
}
</script>

<template>
  <div class="login-container">
    <!--<div> initDataRaw: {{ initDataRaw }}</div>-->
    <!--<div> initDataUnsafe: {{ initDataUnsafe}}</div>-->
    <div>Нажимая кнопку 'Войти', приложение получит доступ к вашим открытым данным.<br>
      Ваши личные данные не пострадают
    </div>
    <button @click="login">Войти</button>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  background: var(--light-color);
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100vh;
  padding: 20px;
  text-align: center;
  box-sizing: border-box;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>