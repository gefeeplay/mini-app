<script setup>
import { ref, computed, watch, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../data/user';
import { getUsers, sendFriendRequest } from '../api/friend';
import SearchInput from './exportComponents/SearchInput.vue';
import Loader from './exportComponents/Loader.vue';

const curTheme = inject('theme');
const router = useRouter()
function goBack() { router.push('/friends') }

const userStore = useUserStore();

const searchQuery = ref("");
const foundUsers = ref([]);
const loadingRequests = ref(new Set()); // для отслеживания отправляемых запросов
const isLoading = ref(false) // для loader'а
let searchTimeout = null // Добавляем debounce для предотвращения частых запросов

// Вычисляем цвет лоадера в зависимости от темы
const loaderColor = computed(() => {
  return curTheme.theme.value == 'dark' ? '#ffffff' : '#333333'
})


watch(searchQuery, async (val) => {
    // Очищаем предыдущий таймер
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }  
  
    // Если пусто — очистить
    if (!val) {
        foundUsers.value = [];
        return;
    }
    
    // обнуляем предыдущие результаты поиска
    foundUsers.value = [] 
    // Устанавливаем состояние загрузки
    isLoading.value = true

    // Задержка перед отправкой запроса (debounce)
    searchTimeout = setTimeout(async () => {
        try {
            const result = await getUsers(val, userStore.getAccessToken())
            foundUsers.value = result
        } catch (e) {
            console.error("Ошибка API:", e)
            alert(`Ошибка при отправке запроса: ${e}`);
            foundUsers.value = []
        } finally {
            isLoading.value = false
        }
    }, 1000) // 1s debounce
});

// --- ОТПРАВКА ЗАПРОСА В ДРУЗЬЯ ---
async function handleSendRequest(user) {
    if (!user || !user.username) {
        console.error("Некорректный пользователь");
        return;
    }

    // Добавляем username в набор загрузки
    loadingRequests.value.add(user.username);

    try {
        await sendFriendRequest(user.username, userStore.getAccessToken());
        console.log(`Запрос на добавление отправлен пользователю ${user.username}`);
        
        // Можно добавить уведомление об успехе
        alert(`Запрос в друзья отправлен пользователю ${user.username}`);
        
        // Опционально: обновить список, убрать пользователя или изменить его статус
        // user.status = 'request_sent';
        
    } catch (error) {
        console.error(`Ошибка при отправке запроса пользователю ${user.username}:`, error);
        const errorMessage = error.response?.data?.detail || error.message;
        alert(`Ошибка при отправке запроса: ${errorMessage}`);
    } finally {
        // Убираем username из набора загрузки
        loadingRequests.value.delete(user.username);
    }
}

// Проверка, отправляется ли сейчас запрос для данного пользователя
function isSendingRequest(user) {
    return loadingRequests.value.has(user.username);
}

// Очищаем таймер при размонтировании компонента
import { onUnmounted } from 'vue'
onUnmounted(() => {
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }
})
</script>

<template>
  <div class="header">
    <button class="back-btn" @click="goBack">
      <span class="material-symbols-outlined">arrow_back</span>
    </button>
    <div class="title find-friend-title">Поиск друзей</div>
  </div>
  <div class="search-input">
      <SearchInput v-model="searchQuery" />
  </div>

  <!-- Loader при поиске -->
  <div v-if="isLoading" class="search-loader">
    <Loader :color="loaderColor" :size="8" />
  </div>

  <!-- СПИСОК НАЙДЕННЫХ ПОЛЬЗОВАТЕЛЕЙ -->
  <div class="fr-list" v-if="foundUsers.length">
      <div class="friend-card"
           v-for="user in foundUsers"
           :key="user.username">
          
          <div class="avatar">
            <span class="material-symbols-outlined" style="color: black; font-size: 2rem;">account_circle</span>
          </div>
          
          <div class="info">
            <div class="username">{{ user.username }}</div>
            <div class="date">
                Зарегистрирован: {{ new Date(user.registrationDate).toLocaleDateString('ru-RU') }}
            </div>
        </div>

          <button 
            @click="handleSendRequest(user)"
            :disabled="isSendingRequest(user)"
            :class="{ 'loading': isSendingRequest(user) }">
            <img 
              v-if="!isSendingRequest(user)"
              src="../assets/add-ellipse-svgrepo-com.svg"
              style="height: 1.5rem;" 
              alt="Добавить в друзья" />
            <span v-else class="loading-spinner">⏳</span>
          </button>
      </div>
  </div>
  <!-- Сообщение, когда пользователи не найдены (только после завершения поиска) -->
  <div v-else-if="searchQuery && !isLoading" class="received-no-users">
    Пользователи не найдены
  </div>
  

</template>

<style scoped>
.search-loader {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    height: 50px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1rem;
}

.find-friend-title{
   flex-grow: 1;
}

.fr-list{
    padding: 0 5%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
}

.friend-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f7f7f7;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.friend-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.info {
  flex: 1;
  margin-left: 1rem;
}

.username {
  font-weight: 600;
  font-size: 1rem;
  text-align: left;
  color: var(--dark-color);
}

.date {
  font-size: 0.85rem;
  color: #777;
  text-align: left;
}

.received-no-users{
  margin-top: 40px;
  color: var(--dark-red-color);
}
</style>