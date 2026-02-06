<script setup>
import { ref, onMounted, inject } from 'vue'
import { tgLogin } from '../api/auth.js'
import { useUserStore } from '../data/user.js'
import { useTelegram } from '../composables/useTelegram.js'
import RotatingText from '../components/exportComponents/RotatingText.vue'
import Loader from '../components/exportComponents/Loader.vue'

const userStore = useUserStore()
const { userData, initDataRaw: telegramInitData } = useTelegram()

const isDevelopment = import.meta.env.DEV
const fakeInitData = import.meta.env.VITE_FAKE_INIT_DATA

// Используем fake данные в development, реальные - в production
const initDataRaw = isDevelopment && fakeInitData
  ? ref(fakeInitData)
  : ref(telegramInitData)

const initDataSend = String(initDataRaw.value)

const setAuthenticated = inject('setAuthenticated')

onMounted(() => {
  if (userData.value?.id) {
    tgLoginValue.value = userData.value.id
    console.log('Telegram ID пользователя:', tgLoginValue.value)
  }
})

const isLoading = ref(false)

async function login() {
  try {
    // Устанавливаем состояние загрузки
    isLoading.value = true

    if (!initDataRaw) {
      alert('Не удалось получить данные пользователя Telegram')
      return
    }

    const data = await tgLogin(initDataSend)
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

    if (data.accessToken) {
      sessionStorage.setItem("refreshToken", data.refreshToken)
      sessionStorage.setItem("accessToken", data.accessToken)
      userStore.setTokens({
        access: data.accessToken,
        refresh: data.refreshToken
      })
    }
    // Записываем дату входа (в миллисекундах)
    localStorage.setItem('loginDate', Date.now().toString())

    if (setAuthenticated) {
      setAuthenticated(true)
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
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">

    <img src="../assets/Group5.svg" style="width: 300px; height: 100px;" />
    <div class="img-description">Каждое тело можно прокачать</div>

    <div class="gainly-text">
      Gainly -
      <RotatingText 
        :texts="['Ставь цели', 'Заряжайся силой', 'Делись с друзьями']" 
        splitBy="lines"
        mainClassName="rotating-part" 
        :staggerFrom="'last'" 
        :initial="{ opacity: 0, scale: 0.8 }"
        :animate="{ opacity: 1, scale: 1 }" 
        :exit="{ opacity: 0, scale: 1.2 }" 
        :staggerDuration="0"
        :transition="{ type: 'spring', damping: 30, stiffness: 400 }" 
        :rotationInterval="2000" />
    </div>

    <div class="description">Погрузитесь в мир тренировок с нашим приложением!<br>
      Войдите через Telegram, чтобы начать тренироваться вместе с друзьями.
    </div>

    <div class="action-container">
      <div v-if="isLoading" class="loader-wrapper">
        <Loader />
      </div>
      <button v-else @click="login" :disabled="isLoading">
        Погнали
      </button>
    </div>

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
  background: linear-gradient(to bottom, #6A80F6 20%, #FFFFFF);
}

.img-description {
  font-weight: 600;
  margin-bottom: 40px;
  color: var(--dark-color);
}

.gainly-text {
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rotating-part {
  display: inline-flex;
  margin-left: 4px;
  padding: 2px 12px;
  background-color: rgb(124, 216, 158);
  color: black;
  border-radius: 8px;
  white-space: nowrap;
}

/* Дополнительно можно попробовать скрыть лишние элементы */
:deep(.sr-only) {
  display: none !important;
}

:deep(split-level) {
  display: inline !important;
}

.description {
  overflow-wrap: break-word;
  white-space: pre-line;
}

button {
  font-size: 1.2rem;
  width: 200px;
  height: 40px;
  margin-top: 20px;
  padding: 10px 20px;
  background: linear-gradient(to bottom right, #92A3FD 0%, #9DCEFF 100%);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.action-container {
  position: fixed;
  bottom: 60px;
  height: 40px;
  /* Высота, равная высоте вашей кнопки */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  /* Отступ, как у кнопки */
}

.loader-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80%;
}

.sr-only {
  display: none !important;
}
</style>