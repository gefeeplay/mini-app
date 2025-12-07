<script setup>
import SearchInput from './exportComponents/SearchInput.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue'
import { useUserStore } from '../data/user'
import { respondToFriendRequest } from '../api/friend';

const userStore = useUserStore()

const router = useRouter()

function goBack() {
    router.push('/friends')
}

// Принять запрос
async function acceptRequest(req) {
  try {
    await respondToFriendRequest(req.friendshipId, true, userStore.accessToken)

    // удалить из стора
    userStore.removeFriendRequest(req.friendshipId)
    alert(response.data)

  } catch (err) {
    const errorMessage = err.response?.data?.detail || err.message;
    alert('Ошибка при отклонении запроса:', errorMessage, err.response?.data?.status)
    console.error('Ошибка при отклонении запроса:', errorMessage, err.response?.data?.status)
  }
}

// Отклонить запрос
async function rejectRequest(req) {
  try {
    await respondToFriendRequest(req.friendshipId, false, userStore.accessToken)

    // удалить из стора
    userStore.removeFriendRequest(req.friendshipId)
    alert(response.data)

  } catch (err) {
    const errorMessage = err.response?.data?.detail || err.message;
    alert('Ошибка при отклонении запроса:', errorMessage, err.response?.data?.status)
    console.error('Ошибка при отклонении запроса:', errorMessage, err.response?.data?.status)
  }
}
</script>

<template>
    <div class="header">
        <button class="back-btn" @click="goBack">
            <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div class="title find-friend-title">Запросы в друзья</div>
    </div>
    <div class="search-input" style="display: block;">
        <SearchInput />
    </div>
    <div class="fr-list">
        <div class="friend-card" v-for="req in userStore.friendRequests" :key="req.friendshipId">
            <div class="avatar">
                <span class="material-symbols-outlined" style="color: black; font-size: 2rem;">account_circle</span>
            </div>
            <div class="info">
                <div class="username">{{ req.fromUsername }}</div>
            </div>
            <div class="btns">
                <button class="btn-accept" @click="acceptRequest(req)">
                    <span class="material-symbols-outlined" style="color: green; font-size: 1.8rem;">check_circle</span>
                </button>

                <button class="btn-reject" @click="rejectRequest(req)">
                    <span class="material-symbols-outlined" style="color: var(--red-color); font-size: 1.8rem;">cancel</span>
                </button>
            </div>
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

.find-friend-title {
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

.btns {
    display: flex;
    gap: 0.5rem;
}

.btn-accept {
    cursor: pointer;
}

.btn-reject {
    cursor: pointer;
}
</style>