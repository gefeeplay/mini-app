<script setup>
import { ref, watch } from 'vue';
import SearchInput from './exportComponents/SearchInput.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../data/user';
import { getUsers } from '../api/friend';

const router = useRouter()
function goBack() { router.push('/friends') }

const userStore = useUserStore();

const searchQuery = ref("");
const foundUsers = ref([]);

// --- ДЕБАУНС ПО КОЛИЧЕСТВУ СИМВОЛОВ: 3, 6, 9... ---
watch(searchQuery, async (val) => {
    // Если пусто — очистить
    if (!val) {
        foundUsers.value = [];
        return;
    }

    // если длина НЕ кратна 3 → ничего не делать
    if (val.length % 3 !== 0) return;

    try {
        const result = await getUsers(val, userStore.getAccessToken());
        foundUsers.value = result;
    } catch (e) {
        console.error("Ошибка API:", e);
    }
});
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

          <button>
            <img src="../assets\add-ellipse-svgrepo-com.svg"
                 style="height: 1.5rem;" />
          </button>
      </div>
  </div>
</template>

<style scoped>
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
</style>