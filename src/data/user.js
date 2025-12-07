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
    const accessToken = ref(sessionStorage.getItem("accessToken"))
    const refreshToken = ref(sessionStorage.getItem("refreshToken"))
    const autoRefreshStarted = ref(false) // чтобы не запускалось дважды
    const avatarUrl = ref(null)
    const friends = ref([])

    function setFriends(friendsList) {
        friends.value = friendsList
    }

    function setAvatarUrl(url) {
        avatarUrl.value = url
    }

    const friendRequests = ref([])

    function setFriendRequests(requests) {
        friendRequests.value = requests
    }

    function removeFriendRequest(id) {
        friendRequests.value = friendRequests.value.filter(r => r.friendshipId !== id)
    }

    const trainingsWithUsername = computed(() =>
        trainings.value.map(t => {
            const raw = t.username ?? username
            return { ...t, usernameStr: unref(raw) }
        })
    )

    // ---- TOKEN FUNCS ----
    function getAccessToken() {
        return accessToken.value
    }

    function getRefreshToken() {
        return refreshToken.value
    }

    function setTokens({ access, refresh }) {
        accessToken.value = access
        refreshToken.value = refresh

        sessionStorage.setItem("accessToken", access)
        sessionStorage.setItem("refreshToken", refresh)
    }

    // ---- 🔄 АВТО-ОБНОВЛЕНИЕ КАЖДЫЕ 15 МИН ----
function startAutoRefreshToken() {
    if (autoRefreshStarted.value) return;

    autoRefreshStarted.value = true;
    console.log("Автообновление токена запущено");

    // Функция для проверки и обновления токена
    async function checkAndRefreshToken() {
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
    }

    // Выполняем обновление токенов при входе
    //refreshAccessToken()

    // Затем запускаем интервал для последующих проверок
    setInterval(checkAndRefreshToken, 60 * 1000); // проверяем каждую минуту
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
        accessToken,
        refreshToken,
        friendRequests,

        // токены/логика
        getAccessToken,
        getRefreshToken,
        setTokens,

        // действия
        startAutoRefreshToken,
        fetchTrainings,
        addTraining,
        removeTraining,
        setUsername,
        loadUsername,
        setFriendRequests,
        removeFriendRequest,
        setFriends,
        setAvatarUrl
    }
})