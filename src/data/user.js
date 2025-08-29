import { defineStore } from 'pinia'
import { ref, computed, unref } from 'vue'
import axios from 'axios'

const API_URL = 'https://gainly.site/workout/api/Workout/workouList'
const REFRESH_URL = 'https://gainly.site/auth/api/auth/refresh'

export const useUserStore = defineStore('user', () => {
    const username = ref('')
    const trainings = ref([])
    const loading = ref(false)
    const error = ref(null)

    const trainingsWithUsername = computed(() =>
        trainings.value.map(t => {
            const raw = t.username ?? username      // либо свой username, либо общий из стора
            return { ...t, usernameStr: unref(raw) } // unref даёт строку
        })
    )

    function getAccessToken() {
        return localStorage.getItem('accessToken')
    }

    function getRefreshToken() {
        return localStorage.getItem('refreshToken')
    }

    async function refreshAccessToken() {
        try {
            const response = await axios.post(REFRESH_URL, {
                refreshToken: getRefreshToken(),
            })
            if (response.data?.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken)
                
                // Обновляем loginDate при успешном обновлении токена
                localStorage.setItem('loginDate', Date.now().toString())

                return response.data.accessToken
            }
            throw new Error('Не удалось обновить токен')       
        } catch (e) {
            console.error('Ошибка обновления токена:', e)
            alert('Не удалось обновить токен', e)
            throw e
        }
    }


    async function fetchTrainings() {
        loading.value = true
        error.value = null
        try {
        const response = await axios.get(API_URL, {
            headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
            },
        })
        trainings.value = response.data || []
        } catch (e) {
        if (e.response?.status === 401) {
            alert('Срок сессии истек, получение доступа...')
            // access token истёк → пробуем обновить
            try {
            const newToken = await refreshAccessToken()
            const retry = await axios.get(API_URL, {
                headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${newToken}`,
                },
            })
            trainings.value = retry.data || []
            } catch (refreshError) {
            error.value = refreshError
            }
        } else {
            console.error('Ошибка загрузки тренировок:', e)
            alert('Ошибка загрузки тренировок:', e)
            error.value = e
        }
        } finally {
        loading.value = false
        }
    }

    function addTraining(training) {
        trainings.value.push(training)
    }

    function removeTraining(id) {
        const idx = trainings.value.findIndex(t => t.tr_id === id)
        if (idx !== -1) trainings.value.splice(idx, 1)
    }

    function setUsername(newName) {
        username.value = newName
        localStorage.setItem('username', newName)
    }

    function loadUsername() {
        const saved = localStorage.getItem('username')
        if (saved) username.value = saved
    }

    return {
        username,
        trainings,
        trainingsWithUsername,
        loading,
        error,
        fetchTrainings,
        addTraining,
        removeTraining,
        setUsername,
        loadUsername,
    }
})