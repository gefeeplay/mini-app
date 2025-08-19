<script setup>
import { inject, ref, computed } from 'vue';
import { useTelegram } from '../composables/useTelegram'
import './ToggleSwitch.vue'
import ToggleSwitch from './ToggleSwitch.vue';
import QrWindow from './QrWindow.vue';

const curTheme = inject('theme');

const { userData } = useTelegram()
const userPhoto = computed(() => userData.value?.photo_url || null)

const username = ref(userData.value ? userData.value.username : 'Неизвестный')

const showQr = ref(false)

</script>

<template>
    <div class="title">
        Настройки
    </div>
    <div class="settings">
        <div class="profile">
            <div>Профиль {{ username }}</div>
            <div class="user-photo" v-if="userPhoto"><img :src="userPhoto"></div>
            <div class="avatar-placeholder" v-else></div>  
            <div class="edit"><span class="material-symbols-outlined">edit</span></div> 
        </div>
        
        <div class="theme">
            <div>Тема: {{ curTheme.theme }}</div>
            <ToggleSwitch/>
        </div>

        <div class="share">
          <div>Поделиться приложением</div>
          <button @click="showQr = true"><span class="material-symbols-outlined">share</span></button>
          <QrWindow :bot-username="'gefeeminiappbot'" :show="showQr" @close="showQr = false" />
        </div>
        <div class="exit">Выйти</div>
    </div>
</template>

<style scoped>
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
  overflow: hidden;
}

.user-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  border-radius: 50%;
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

.edit {
  position: fixed;
  right: 32px;
}

.theme {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.theme, .profile, .exit, .share {
  border: 1px solid var(--theme-color);
  border-radius: 0.5rem;
  padding: 1rem;
  box-sizing: border-box;
}

.exit {
  background: var(--red-color);
  cursor: pointer;
}

.share {
  text-align: start;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  cursor: pointer;
}
</style>