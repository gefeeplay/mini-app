<script setup>
import { inject, ref } from 'vue';
import { useTelegram } from '../composables/useTelegram'
import './ToggleSwitch.vue'
import ToggleSwitch from './ToggleSwitch.vue';

const curTheme = inject('theme');

const { userData } = useTelegram()
const userPhoto = ref(userData.photo_url)
</script>

<template>
    <div class="title">
        Настройки
    </div>
    <div class="settings">
        <div class="profile" v-if="userData">
            <div >Профиль {{ userData.username }}</div>
            <div class="user-photo" v-if="userPhoto"><img :src="userPhoto"></div>
            <div class="avatar-placeholder"v-else></div>
        </div>
        <div class="profile" v-else>
            <div>Профиль Неизвестный</div>
            <div class="avatar-placeholder"></div>
        </div>
        
        <div class="theme">
            <div>Тема: {{ curTheme.theme }}</div>
            <ToggleSwitch/>
        </div>
    </div>
</template>

<style scoped>
.profile {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 1rem;
  border: 1px solid var(--theme-color);
  min-height: 4rem;
}

.user-photo {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #007aff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.settings {
  display: grid;
  grid-template-columns: 1fr;
  width: 100gh;
  align-items: center;
  justify-content: start;
  padding: 0 1rem;
  margin: 0.5rem 0;
  gap: 0.5rem;
}

.theme {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.theme, .profile {
    border: 1px solid var(--theme-color);
    border-radius: 0.5rem;
    padding: 1rem;
    box-sizing: border-box;
}
</style>