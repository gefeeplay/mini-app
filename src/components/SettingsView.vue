<script setup>
import { inject, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { useTelegram } from '../composables/useTelegram'
import { useUserStore } from '../data/user';
import ToggleSwitch from './exportComponents/ToggleSwitch.vue';
import QrWindow from './QrWindow.vue';
import ChangeProfile from './ChangeProfile.vue';
import { uploadAvatar } from '../api/avatars';


const curTheme = inject('theme');
const setAuthenticated = inject('setAuthenticated')

const { userData } = useTelegram()
const userStore = useUserStore()
const router = useRouter()

const userPhoto = computed(() => userData.value?.photo_url || null)

const tgUsername = ref(userData.value ? userData.value.username : 'Неизвестный') /* имя в телеграмме*/

const showQr = ref(false)
const showEdit = ref(false)

const saveUser = (newUsername) => {
  userStore.setUsername(newUsername)
}

const saveAvatar = async (file) => {
  if (!file) return;

  const token = userStore.getAccessToken();
  if (!token) return;

  try {
    // Передаем файл напрямую, функция сама создаст FormData
    const result = await uploadAvatar(file, token);

    console.log('Аватарка загружена:', result);
    
    // Фиксируем GUID из ответа
    if (result.data && result.data.guid) {
      const avatarGuid = result.data.guid;
      alert(`Аватарка успешно загружена! ID: ${avatarGuid}`);
      
    } else {
      alert('Аватарка загружена, но сервер не вернул ID');
    }
  } catch (err) {
    console.error('Ошибка загрузки аватарки:', err);
    const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message;
    alert(`Ошибка при загрузке аватарки: ${errorMessage}`);
  }
};

onMounted(() => {
  userStore.loadUsername()
})

/* Функия выхода */
const logout = () => {
  // Очистить localStorage
  localStorage.clear()

  // Перенаправить на главную страницу
  router.push('/')

  if (setAuthenticated) {
    setAuthenticated(false) // для App.vue
  }
}

</script>

<template>
  <div class="title">
    Настройки
  </div>
  <div class="settings">
    <div class="profile">
      <div>Профиль
        <k v-if="userStore.username">{{ userStore.username }}</k>
        <k v-else>{{ tgUsername }}</k>
      </div>
      <div class="user-photo" v-if="userPhoto"><img :src="userPhoto"></div>
      <div class="avatar-placeholder" v-else></div>
      <button class="edit" @click="showEdit = true"><span class="material-symbols-outlined">edit</span></button>
      <ChangeProfile :showEdit="showEdit" @closeEdit="showEdit = false" @saveUser="saveUser" @saveAvatar="saveAvatar" />
    </div>

    <div class="theme">
      <div>Тема: {{ curTheme.theme }}</div>
      <ToggleSwitch />
    </div>

    <div class="share">
      <div>Поделиться приложением</div>
      <button @click="showQr = true"><span class="material-symbols-outlined">share</span></button>
      <QrWindow :bot-username="'gefeeminiappbot'" :show="showQr" @close="showQr = false" />
    </div>
    <div class="exit" @click="logout">Выйти</div>
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

.theme {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.theme,
.profile,
.exit,
.share {
  border: 1px solid var(--theme-color);
  border-radius: 0.5rem;
  padding: 1rem;
  box-sizing: border-box;
}

.exit {
  background: var(--red-color);
  text-align: center;
  cursor: pointer;
  transition: 0.2s;
}

.exit:hover {
  opacity: 0.8;
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

.edit {
  position: fixed;
  right: 32px;
  cursor: pointer;
}
</style>