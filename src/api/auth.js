import axios from 'axios'

const API_URL = 'https://fitness-app-auth-api.fly.dev/api/auth'

export async function tgLogin(tgLogin) {
  try {
    const response = await axios.post(`${API_URL}/tglogin`, {
      tgLogin: tgLogin
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Ошибка при логине через tgLogin:', error)
    throw error
  }
}