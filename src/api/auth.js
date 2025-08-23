import axios from 'axios'

/*const API_URL = 'https://fitness-app-auth-api.fly.dev/api/auth'*/
const API_URL = '/api/auth' /* url в vite.config.js - пока без CORS на бэке*/
const API_KEY = 'your-super-secret-api-key'

export async function tgLogin(initDataRaw) {
  try {
    const response = await axios.post(
      `${API_URL}/tglogin`,
      { initDataRaw }, // тело запроса
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-API-KEY': API_KEY,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Ошибка при логине через tgLogin:', error.response || error)
    throw error
  }
}