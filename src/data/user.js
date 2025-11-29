import { defineStore } from 'pinia'
import { ref, computed, unref } from 'vue'
import { refreshAccessToken } from '../api/auth.js'
import { fetchTrainings as apiFetchTrainings } from '../api/workout.js'

// 15 минут в миллисекундах
const REFRESH_INTERVAL = 15 * 60 * 1000

export const useUserStore = defineStore('user', () => {
    const username = ref('')
    const trainings = ref([])
    const loading = ref(false)
    const error = ref(null)
    const autoRefreshStarted = ref(false) // чтобы не запускалось дважды

    const friends = ref([
        { username: 'Miska', photo_url: '', date: '20.01.2025' },
        { username: 'Alex', photo_url: '', date: '20.08.2025' }
    ])

    const trainingsWithUsername = computed(() =>
        trainings.value.map(t => {
            const raw = t.username ?? username
            return { ...t, usernameStr: unref(raw) }
        })
    )

    // ---- TOKEN FUNCS ----
    function getAccessToken() {
        return localStorage.getItem('accessToken')
    }

    function getRefreshToken() {
        return localStorage.getItem('refreshToken')
    }

    // ---- 🔄 АВТО-ОБНОВЛЕНИЕ КАЖДЫЕ 15 МИН ----
    function startAutoRefreshToken() {
        if (autoRefreshStarted.value) return;

        autoRefreshStarted.value = true;
        console.log("Автообновление токена запущено");

        setInterval(async () => {
            const loginDateStr = localStorage.getItem("loginDate");

            if (!loginDateStr) {
                console.warn("loginDate отсутствует, пропускаем автообновление");
                return;
            }

            const loginDate = Number(loginDateStr);
            const now = Date.now();

            const diffMinutes = (now - loginDate) / 1000 / 60;

            console.log(`⏱ Время после loginDate: ${diffMinutes.toFixed(1)} мин`);

            // Если прошло >= 15 минут → обновляем токен
            if (diffMinutes >= 15) {
                console.log("⏳ Прошло больше 15 минут — обновляем токен...");
                await refreshAccessToken();
            }
            
        }, 60 * 1000); // проверяем каждую минуту
    }

    // ---- FETCH TRAININGS ----
    async function fetchTrainings() {
        loading.value = true
        error.value = null

        try {
            const data = await apiFetchTrainings()
            trainings.value = data

        } catch (e) {
            error.value = e
        } finally {
            loading.value = false
        }
    }

    function addTraining(t) {
        trainings.value.push(t)
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
        friends,
        loading,
        error,

        // токены/логика
        getAccessToken,
        getRefreshToken,
        refreshAccessToken,
        startAutoRefreshToken,

        // действия
        fetchTrainings,
        addTraining,
        removeTraining,
        setUsername,
        loadUsername,
    }
})