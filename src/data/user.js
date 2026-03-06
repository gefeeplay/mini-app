import { defineStore } from 'pinia'
import { ref, computed, unref } from 'vue'
import { refreshAccessToken } from '../api/auth.js'
import { useTelegram } from '../composables/useTelegram.js'

// 15 минут в миллисекундах
const REFRESH_INTERVAL = 15 * 60 * 1000

export const useUserStore = defineStore('user', () => {
    const username = ref('')
    const trainings = ref([])
    const workouts = ref([])
    const loading = ref(false)
    const error = ref(null)
    const accessToken = ref(sessionStorage.getItem("accessToken"))
    const refreshToken = ref(sessionStorage.getItem("refreshToken"))
    const autoRefreshStarted = ref(false) // чтобы не запускалось дважды
    const friends = ref([])
    const avatars = ref({})


    function setFriends(friendsList) {
        friends.value = friendsList
    }

    // Функции для аватарок
     function setAvatar(username, url) {
        avatars.value[username] = url
    }

    function getAvatar(username) {
        return avatars.value[username]
    }

    function hasAvatar(username) {
        return avatars.value[username] !== undefined
    }

    function clearAvatar(username) {
        if (avatars.value[username]) {
            delete avatars.value[username]
        }
    }

    function clearAllAvatars() {
        avatars.value = {}
    }


    // Запросы в друзья
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

    // Тренировки
    function setWorkouts(list) {
    workouts.value = list
    }

    function addWorkout(workout) {
        workouts.value.unshift(workout)
    }

    function removeWorkout(id) {
        workouts.value = workouts.value.filter(w => w.id !== id)
    }

    function clearWorkouts() {
        workouts.value = []
    }

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
        // Проверяем, запущено ли уже автообновление
        if (autoRefreshStarted.value) return;
        
        try {
            // Получаем данные Telegram
            const { userData } = useTelegram();
            
            // Проверяем наличие Telegram данных
            if (!userData || !userData.value) {
                console.log("Telegram данные отсутствуют, автообновление не запускается");
                return;
            }
            
            // Если Telegram данные есть, запускаем автообновление
            autoRefreshStarted.value = true;
            console.log("Telegram данные найдены, автообновление токена запущено");
            
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
            refreshAccessToken();

            // Затем запускаем интервал для последующих проверок
            setInterval(checkAndRefreshToken, 60 * 1000); // проверяем каждую минуту
            
        } catch (error) {
            // Если useTelegram() выбрасывает ошибку, значит Telegram провайдер не настроен
            console.log("Telegram не инициализирован, автообновление не запускается", error.message);
        }
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
        avatars,
        workouts,

        // токены/логика
        getAccessToken,
        getRefreshToken,
        setTokens,

        // действия
        startAutoRefreshToken,
        setUsername,
        loadUsername,
        setFriendRequests,
        removeFriendRequest,
        setFriends,
        
        //Аватарки
        setAvatar,
        getAvatar,
        hasAvatar,
        clearAvatar,
        clearAllAvatars,
        
        //Тренировки
        setWorkouts,
        addWorkout,
        removeWorkout,
        clearWorkouts,
    }
})