<script setup>
import { ref } from 'vue'
import SearchInput from './exportComponents/SearchInput.vue';

const username = ''
const photo_url = ''


const date = new Date();
const day = String(date.getDate()).padStart(2, '0'); 
const month = String(date.getMonth() + 1).padStart(2, '0');
const year = date.getFullYear();

const dateFromAdd = `${day}.${month}.${year}`; 

const friends = ref([
    {
        username: 'Miska',
        photo_url: 'https://t.me/i/userpic/320/2cXXMBKksn2jvadNJFGJLUMjCLWWa6wcUhCZPT962M8.svg',
        date: dateFromAdd
    },
    {
        username: 'Alex',
        photo_url: '',
        date: '20.08.2025'
    }
]);
</script>

<template>
    <div class="title">
        Друзья
    </div>
    <div class="input">
        <SearchInput/>
        <button class="create" @click="showCreate = true">
              <span class="material-symbols-outlined">add_circle</span>
        </button>
    </div>
    <div class="fr-list">
        <div class="friend-card" v-for="friend in friends" :key="friend.username">
            <img :src="friend.photo_url || 'https://via.placeholder.com/50'" 
                alt="avatar" 
                class="avatar"
            />
            <div class="info">
                <div class="username">{{ friend.username }}</div>
                <div class="date">Добавлен: {{ friend.date }}</div>
            </div>
            <button><img src="../assets/chat-round-dots-svgrepo-com.svg" style="height: 1.5rem;" /></button>
        </div>
    </div>   
    
</template>

<style scoped>
.input {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5%;
  gap: 1rem;
}

.create {
  cursor: pointer;
}

.fr-list{
    padding: 0 10%;
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