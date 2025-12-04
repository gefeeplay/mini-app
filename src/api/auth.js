import { useUserStore } from '../data/user.js'
import axios from 'axios'

const API_URL = 'https://gainly.site/auth/api/auth'
const REFRESH_URL = 'https://gainly.site/auth/api/auth/refresh'
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}

export async function tgLogin(initDataRaw) {
  try {
    const response = await axios.post(
      `${API_URL}/tglogin`,
      {initDataRaw: initDataRaw}, // тело запроса
      {
        headers: headers
      }
    )
    return response.data
  } catch (error) {
    console.error('Ошибка при логине через tgLogin:', error.response || error)
    throw error
  }
}

export async function refreshAccessToken() {
  const userStore = useUserStore()
  const refreshToken = userStore.getRefreshToken()
    if (!refreshToken) {
        console.warn("Нет refresh токена — автообновление остановлено")
        return null
    }

    try {
        const response = await axios.post(REFRESH_URL, { refreshToken })

        if (response.data?.accessToken) {
            userStore.setTokens({
                access: response.data.accessToken,
                refresh: response.data.refreshToken
            })
            localStorage.setItem('loginDate', Date.now().toString())
            console.log("Access token обновлён автоматически")
            return response.data.accessToken
        }

        throw new Error("Не удалось обновить токен")

    } catch (e) {
        console.error("Ошибка автообновления токена:", e)
        return null
    }
}