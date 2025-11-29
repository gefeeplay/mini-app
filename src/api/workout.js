import axios from 'axios'
import { refreshAccessToken } from './auth.js'

const API_URL = 'https://gainly.site/workout/api/Workout/workouList'

export async function fetchTrainings() {
    const accessToken = localStorage.getItem('accessToken')

    try {
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${accessToken}` },
        })

        return response.data || []

    } catch (e) {
        if (e.response?.status === 401) {
            console.warn("401 — пробуем обновить токен...")

            try {
                const newToken = await refreshAccessToken()

                if (!newToken) throw new Error("Рефреш токена не удался")

                const retry = await axios.get(API_URL, {
                    headers: { Authorization: `Bearer ${newToken}` },
                })

                return retry.data || []

            } catch (refreshError) {
                throw refreshError
            }
        } else {
            throw e
        }
    }
}