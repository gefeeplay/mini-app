import axios from 'axios'

const API_URL = 'https://gainly.site/auth/api/auth'
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