<script setup>
import { onMounted, computed } from 'vue'
import SearchInput from './exportComponents/SearchInput.vue';
import { useUserStore } from '../data/user'
import { getFriendRequests, getFriendsList } from '../api/friend';

const userStore = useUserStore()

// 👉 получение запросов в друзья
onMounted(async () => {

  if (!userStore.friends.length > 0) {
    try {
      const token = userStore.accessToken
      if (!token) return

      const friendList = await getFriendsList(token)

      // сохранить в store
      userStore.setFriends(friendList)

      console.log('Друзья:', userStore.friends)
    } catch (err) {
        console.error(`Ошибка при запросе списка друзей ${user.username}:`, err);
        const errorMessage = err.response?.data?.detail || er.message;
        alert(`Ошибка при запросе списка друзей: ${errorMessage}`, er.response?.data?.status);
    }
  }

  //Выполнияем только если запросов нет
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
</script>

<template>
    <div class="title">
        Друзья
    </div>
    <div class="search-input search-cont">
        <SearchInput/>
        <button class="create" @click="$router.push('/friends/find')">
          <span class="material-symbols-outlined">add_circle</span>
        </button>
        <button class="create" @click="$router.push('/friends/requests')">
          <span class="material-symbols-outlined">notifications</span>
          <span v-if="requestsCount > 0" class="notif-badge">{{ requestsCount }}</span>
        </button>
    </div>
    <div class="fr-list">
        <div class="friend-card" v-for="friend in userStore.friends" :key="friend.username">
            <div class="avatar">
              <span class="material-symbols-outlined" style="color: black; font-size: 2rem;">account_circle</span>
            </div>
            <div class="info">
                <div class="username">{{ friend.username }}</div>
                <div class="date">С нами с: {{ new Date(friend.registrationDate).toISOString().slice(0, 10) }}</div>
            </div>
            <button><img src="../assets/chat-round-dots-svgrepo-com.svg" style="height: 1.5rem;" /></button>
        </div>
    </div>   
    
</template>

<style scoped>

.search-cont{
  display: flex;
  align-items: center;
}

.create {
  position: relative;
  cursor: pointer;
  height: 1.5rem;
}

.notif-badge{
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