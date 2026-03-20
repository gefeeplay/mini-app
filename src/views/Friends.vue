<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import SearchInput from '../components/exportComponents/SearchInput.vue';
import UserProfile from './UserProfile.vue';
import { useUserStore } from '../data/user'
import { getFriendRequests, getFriendsList } from '../api/friend';
import { getAvatar } from '../api/avatars';
import { Icon } from '@iconify/vue';

const userStore = useUserStore()

const loadAvatar = async (username) => {
  const token = userStore.accessToken;
  if (!token) return;

  // Проверяем, есть ли уже аватарка в хранилище
  if (userStore.hasAvatar(username)) return;

  try {
    const url = await getAvatar(token, username);
    userStore.setAvatar(username, url);
  } catch (err) {
    console.warn(`Аватар ${username} не найден — ставим fallback`);
    userStore.setAvatar(username, null);
  }
};

// 👉 получение запросов в друзья
onMounted(async () => {

  //Выполняем только если есть друзья
  if (!userStore.friends.length > 0) {
    //Список друзей
    try {
      const token = userStore.accessToken
      if (!token) return

      const friendList = await getFriendsList(token)

      // сохранить в store
      userStore.setFriends(friendList)

      // Загружаем аватарки всех друзей
      for (const friend of userStore.friends) {
        loadAvatar(friend.username);
      }

      console.log('Друзья:', userStore.friends)
    } catch (er) {
      console.error(`Ошибка при запросе списка друзей ${userStore.username}:`, er);
      const errorMessage = er.response?.data?.detail || er.message;
      alert(`Ошибка при запросе списка друзей: ${errorMessage}`, er.response?.data?.status);
    }

  }

  //Выполняем только если запросов нет
  if (!userStore.friendRequests.length > 0) {
    try {
      const token = userStore.accessToken
      if (!token) return

      const requests = await getFriendRequests(token)

      // сохранить в store
      userStore.setFriendRequests(requests)

      //console.log('Friend requests:', userStore.friendRequests)
    } catch (err) {
      console.error('Ошибка при загрузке запросов:', err)
    }
  }
})

const requestsCount = computed(() => userStore.friendRequests.length)

//Состояние окна профиля
const selectedFriend = ref(null)
const isProfileOpen = ref(false)

const openProfile = (friend) => {
  selectedFriend.value = friend
  isProfileOpen.value = true
}

const closeProfile = () => {
  isProfileOpen.value = false
  selectedFriend.value = null
}
</script>

<template>
  <div class="title">
    Друзья
  </div>
  <div class="search-input search-cont">
    <SearchInput />
    <button class="create" @click="$router.push('/friends/find')">
      <span class="material-symbols-outlined">add_circle</span>
    </button>
    <button class="create" @click="$router.push('/friends/requests')">
      <span class="material-symbols-outlined">notifications</span>
      <span v-if="requestsCount > 0" class="notif-badge">{{ requestsCount }}</span>
    </button>
  </div>

  <!-- Friend list -->
  <div class="fr-list">
    <div class="friend-card" v-for="friend in userStore.friends" :key="friend.username">
      <div class="avatar">
        <!-- Используем аватарку из хранилища -->
        <img v-if="userStore.getAvatar(friend.username)" :src="userStore.getAvatar(friend.username).url"
          class="avatar" />
        <span v-else class="material-symbols-outlined" style="color: black; font-size: 2rem;">
          account_circle
        </span>
      </div>

      <div class="info">
        <div class="username">{{ friend.username }}</div>
        <div class="date">С нами с: {{ new Date(friend.registrationDate).toISOString().slice(0, 10) }}</div>
      </div>

      <button @click="openProfile(friend)">
        <Icon icon="material-symbols:info-outline-rounded" width="24" height="24" color="var(--dark-color)"/>
      </button>

    </div>

    <!-- Profile modal -->
    <UserProfile v-if="selectedFriend" :user="selectedFriend" @close="closeProfile" />
    
  </div>

</template>

<style scoped>
.search-cont {
  display: flex;
  align-items: center;
}

.create {
  position: relative;
  cursor: pointer;
  height: 1.5rem;
}

.notif-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: var(--red-color);
  color: white;
  height: 12px;
  width: 12px;
  box-sizing: border-box;
  padding-top: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.5rem;
}

.fr-list {
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.friend-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}


.avatar {
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

.msg-btn {
  background: #4a90e2;
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.msg-btn:hover {
  background: #357ab7;
}
</style>