<script setup>
import { ref, onMounted, inject } from 'vue'
import { tgLogin } from '../api/auth.js'
import { useUserStore } from '../data/user.js'
import { useTelegram } from '../composables/useTelegram.js'

const userStore = useUserStore()
const { userData, initDataRaw } = useTelegram()

/* Только для разработки*/
/*const fakeInitData = "user=%7B%22id%22%3A909844183%2C%22first_name%22%3A%22Miska%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22gefeeRu%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F2cXXMBKksn2jvadNJFGJLUMjCLWWa6wcUhCZPT962M8.svg%22%7D&chat_instance=-6139284978316757086&chat_type=sender&auth_date=1755960241&signature=aA673g3WFjZ7Mu1-8HhKTZfIaPye5lxYnf44Dgmjtmnbv9YEP3ihlhxTivVoZp1Pm0wJVZhMlJYqdNy2A1_CAw&hash=63bbaca6ddc2c8c6be6a4f8c130ec401b0838b8723390a5aaec07c375dea2af3";
const initDataRaw = fakeInitData
*/

const initDataSend = String(initDataRaw.value) /* .value если не fake*/

const setAuthenticated = inject('setAuthenticated')

onMounted(() => {
  if (userData.value?.id) {
    tgLoginValue.value = userData.value.id
    console.log('Telegram ID пользователя:', tgLoginValue.value)
  }
})

async function login() {
  try {
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
      localStorage.setItem('accessToken', data.accessToken)
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken)
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
  }
}
</script>

<template>
  <div class="login-container">
    <div>Нажимая кнопку 'Войти', приложение получит доступ к вашим открытым данным.<br>
      Ваши личные данные не пострадают.
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

div {
  overflow-wrap: break-word;
  white-space: pre-line;
}
</style>