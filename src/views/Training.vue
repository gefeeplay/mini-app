<script setup>
import { useUserStore } from '../data/user'
import { ref, onMounted, computed } from 'vue'
import { useTelegram } from '../composables/useTelegram'
import SearchInput from '../components/exportComponents/SearchInput.vue'
import CreateTrainingOnePage from '../components/CreateTrainingOnePage.vue'
import { getWorkoutList } from '../api/workout.js'
import { Icon } from '@iconify/vue'

const userStore = useUserStore()
const { userData } = useTelegram()
const workouts = computed(() => userStore.workouts)
const userPhoto = computed(() => userData.value?.photo_url || null)

onMounted(() => {
  loadWorkouts()
})

async function loadWorkouts() {
  if (userStore.workouts.length > 0) {
    return
  }

  try {
    const token = userStore.getAccessToken()
    const data = await getWorkoutList(token)

    userStore.setWorkouts(data)
  } catch (err) {
    console.error('Ошибка загрузки тренировок', err)
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr)

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const showCreate = ref(false);

</script>

<template>
  <div class="title">
    Тренировки
  </div>

  <div class="search-input">
    <SearchInput />
  </div>

  <div class="def-text">
    Мои тренировки:
  </div>

  <div class="tr-list">

    <div class="tr-create tr-item">
      Добавить тренировку
      <button class="create" @click="showCreate = true">
        <span class="material-symbols-outlined">add_circle</span>
      </button>
    </div>

    <CreateTrainingOnePage :show="showCreate" @close="showCreate = false" />

    <transition-group name="list" tag="div" class="tr-items">

      <div class="tr-item" v-for="item in workouts" :key="item.id">

        <div class="tr-header">

          <div class="user-block">
            <div class="avatar-placeholder">
              <div class="user-photo" v-if="userPhoto"><img :src="userPhoto"></div>
              <div v-else> A</div>
            </div>
          </div>

          <div class="tr-info">
            <div class="tr-title">
              {{ item.title }}
            </div>

            <div class="tr-date">
              {{ formatDate(item.date) }}
            </div>
          </div>

          <div class="tr-actions">
            <button class="icon-btn">
              <Icon icon="lucide:info" width="22" height="22" color="#666" />
            </button>

            <button class="icon-btn delete">
              <Icon icon="material-symbols:delete" width="24" height="24" color="var(--red-color)" />
            </button>
          </div>

        </div>

      </div>

    </transition-group>
  </div>
</template>


<style scoped>
.title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 1rem;
  text-align: center;
  color: var(--theme-color, #0088cc);
}

.def-text {
  text-align: start;
  margin: 2rem;
}

.tr-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.tr-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  /* расстояние между карточками */
  width: 100%;
  /* чтобы .tr-item 80% считалось от ширины списка */
}

.tr-item {
  background: #e5e5ea;
  border-radius: 1rem;
  padding: 1rem;
  width: 90%;
  max-width: 420px;
}

.tr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-block {
  display: flex;
  align-items: center;
}

.avatar-placeholder {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  background: #d1c4e9;
  color: #5e35b1;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-photo {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  overflow: hidden;
}

.tr-info {
  flex: 1;
  margin-left: 0.8rem;
}

.tr-title {
  text-align: left;
  color: #666;
  font-weight: 600;
  font-size: 1rem;
}

.tr-date {
  text-align: left;
  font-size: 0.85rem;
  color: #666;
}

.tr-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
}

.delete {
  color: #d32f2f;
}

.tr-create {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.create {
  cursor: pointer;
}

/* animation */

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>