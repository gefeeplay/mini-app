<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '../data/user';
import { getUserProfile, getFriendTrainings } from '../api/workout';
import Loader from '../components/exportComponents/Loader.vue';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const userStore = useUserStore();

const profileData = ref(null)
const isLoading = ref(false)
const isWorkoutLoading = ref(false)

const { user } = defineProps({
  user: Object
})

defineEmits(['close'])

const stats = computed(() => {
  //Проверка на undefined
  const month = profileData.value?.workoutsLast30Days ?? 0

  return {
    totalWorkouts: profileData.value?.workoutsTotal ?? 0,

    avgPerDay: Number((month / 30).toFixed(2)),

    monthWorkouts: month,

    favoriteExercise: profileData.value?.favoriteExercise ?? '-'
  }
})

const loadProfile = async () => {
  const token = userStore.accessToken

  if (!token || !user?.username) return

  isLoading.value = true

  try {
    const data = await getUserProfile(token, user.username)
    profileData.value = data
  } catch (err) {
    console.error('Ошибка загрузки профиля:', err)
  } finally {
    isLoading.value = false
  }
}

const dateFrom = ref(null)
const dateTo = ref(null)
const isCustomRange = ref(false)

const formatDate = (date) => {
  return date.toISOString().slice(0, 10)
}

const setDefaultLast30Days = () => {
  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - 30)

  const toPlusOne = new Date(to)
  toPlusOne.setDate(to.getDate() + 1)

  dateFrom.value = from
  dateTo.value = toPlusOne

  isCustomRange.value = false
}

const workouts = ref([])

const addOneDay = (date) => {
  const d = new Date(date)
  d.setDate(d.getDate() + 1)
  return formatDate(d)
}

const loadWorkouts = async () => {
  const token = userStore.accessToken
  if (!token || !user?.username) return

  isWorkoutLoading.value = true

  try {
    // 👉 всегда используем диапазон дат
    if (!dateFrom.value || !dateTo.value) return

    const data = await getFriendTrainings(token, user.username, {
      from: formatDate(dateFrom.value),
      to: addOneDay(dateTo.value) //Добавляем 1 день т.к. сегодняшние тренировки не отображаются
    })

    workouts.value = data

  } catch (err) {
    console.error('Ошибка загрузки тренировок:', err)
  }finally {
    isWorkoutLoading.value = false
  }
}

const onFromChange = (date) => {
  dateFrom.value = date
  isCustomRange.value = true

  if (dateTo.value) loadWorkouts()
}

const onToChange = (date) => {
  dateTo.value = date
  isCustomRange.value = true

  if (dateFrom.value) loadWorkouts()
}

onMounted(() => {
  loadProfile()
  setDefaultLast30Days()
  loadWorkouts()
})

const isPickerOpen = ref(false)
const closePicker = () => {
  isPickerOpen.value = false

  // снимаем фокус → закрывает picker
  document.activeElement?.blur()
}

</script>

<template>
  <div class="profile-modal">

    <!-- HEADER -->
    <div class="profile-header">
      <div class="avatar">
        <!-- Используем аватарку из хранилища -->
        <img v-if="userStore.getAvatar(user.username)" :src="userStore.getAvatar(user.username).url" class="avatar" />
        <span v-else class="material-symbols-outlined" style="color: black; font-size: 4rem;">
          account_circle
        </span>
      </div>

      <div class="user-info">
        <h2>{{ user.username }}</h2>
        <span class="member-since">
          С нами с {{ new Date(user.registrationDate).toISOString().slice(0, 10) }}
        </span>
      </div>
    </div>

    <!-- STATS -->
    <div class="stats-grid">
      <div class="stat-card">
        <span class="label">Тренировки</span>
        <div class="value" v-if="!isLoading">
          {{ stats.totalWorkouts }}
          <span class="trend positive">+5%</span>
        </div>
        <div class="loader-con" v-else>
          <Loader :size="4" />
        </div>
      </div>

      <div class="stat-card">
        <span class="label">Тренировок в день</span>
        <div class="value" v-if="!isLoading">
          {{ stats.avgPerDay }}
          <span class="trend neutral">-</span>
        </div>
        <div class="loader-con" v-else>
          <Loader :size="4" />
        </div>
      </div>

      <div class="stat-card">
        <span class="label">За 30 дней</span>
        <div class="value" v-if="!isLoading">
          {{ stats.monthWorkouts }}
          <span class="trend negative">-5</span>
        </div>
        <div class="loader-con" v-else>
          <Loader :size="4" />
        </div>
      </div>

      <div class="stat-card">
        <span class="label">Любимое упражнение</span>
        <div class="value link" v-if="!isLoading">
          {{ stats.favoriteExercise }}
        </div>
        <div class="loader-con" v-else>
          <Loader :size="4" />
        </div>
      </div>
    </div>

    <!-- WORKOUTS -->
    <div class="workouts">

      <div class="workouts-header">
        <h4>Последние тренировки</h4>

        <div v-if="isPickerOpen" class="dp-overlay" @click="closePicker"></div>

        <div class="dates">
          <VueDatePicker v-model="dateFrom" @update:model-value="onFromChange" @open="isPickerOpen = true"
            @closed="isPickerOpen = false" :time-config="{ enableTimePicker: false }" centered
            placeholder="From" />

          <VueDatePicker v-model="dateTo" @update:model-value="onFromChange" @open="isPickerOpen = true"
            @closed="isPickerOpen = false" :time-config="{ enableTimePicker: false }" centered
            placeholder="To" />
        </div>
      </div>

      <div class="workout-list" v-if="!isWorkoutLoading">
        <div v-for="workout in workouts" :key="workout.id" class="workout-item">
          <div class="icon"></div>

          <div class="info">
            <span class="workout-title">{{ workout.title }}</span>
            <span class="date">{{ new Date(workout.date).toISOString().slice(0, 10) }}</span>
          </div>

          <span class="arrow">›</span>
        </div>
      </div>
      <div class="big-loader-con" v-else>
        <Loader :size="10"/>
      </div>

    </div>

  </div>
  <button class="overlay-close-btn" type="button" @click="$emit('close')">
    ×
  </button>
</template>

<style scoped>
.profile-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;

  background: var(--not-theme-color, #f6f6fb);

  display: flex;
  flex-direction: column;
  align-items: center;

  height: 100vh;
  overflow: hidden;
}

/* HEADER */
.profile-header {
  display: flex;
  width: 85%;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
  text-align: start;
  gap: 4px;
  min-width: 0;
}

.user-info h2 {
  max-width: 200px;       /* ограничение ширины */
  white-space: nowrap;    /* запрет переноса */
  overflow: hidden;       /* обрезка */
  text-overflow: ellipsis; /* ... */
}

h2{
  margin: 0.25rem 0;
}

.member-since {
  font-size: 14px;
}

/* STATS */
.stats-grid {
  display: grid;
  width: 90%;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  justify-content: center;
  gap: 12px;
  margin: 16px 16px 0 16px;
}

.stat-card {
  text-align: start;
  background: #e5e5ea;
  padding: 14px;
  border-radius: 14px;
}

.label {
  font-size: 12px;
  color: #888;
}

.value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 16px;
  margin-top: 6px;
  font-size: 18px;
  font-weight: 600;
  color: var(--dark-color);
}

.value.link {
  color: #4a7cff;
}

.loader-con {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  margin-top: 12px;
}

.big-loader-con{
  position: absolute;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 250px;
}

.trend {
  margin-left: 6px;
  font-size: 12px;
}

.trend.positive {
  color: #2ecc71;
}

.trend.negative {
  color: #e74c3c;
}

.trend.neutral {
  color: #888;
}

/* WORKOUTS */
.workouts {
  width: 85%;
  margin-top: 20px;
}

.workouts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-picker {
  background: #e5e5ea;
  color: var(--dark-color);
  border: none;
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 12px;
  cursor: pointer;
}

.workout-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  padding: 10px;
  max-height: 350px;     /* 🔥 ограничение */
  overflow-y: auto;      /* 🔥 включаем скролл */
  flex: 1; 
}

.workout-item {
  display: flex;
  align-items: center;
  background: #e5e5ea;
  width: 90%;
  padding: 12px;
  border-radius: 12px;
}

.icon {
  width: 40px;
  height: 40px;
  background: #d1d5db;
  border-radius: 10px;
}

.info {
  text-align: start;
  margin-left: 18px;
  flex: 1;
}

.workout-title {
  color: var(--dark-color);
  display: block;
  font-weight: 600;
}

.dates {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dp__main {
  width: 100%;
}

.dp__input {
  background: #e5e5ea;
  border-radius: 10px;
  border: none;
  padding: 6px 10px;
}

.dp__theme_light {
  --dp-background-color:#e5e5ea;
  --dp-border-radius: 8px;
}

.dp__menu-wrapper {
  z-index: 1000 !important;
}

.dp-overlay {
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.4);

  z-index: 999;
  /* ниже календаря */
}

.date {
  font-size: 12px;
  color: #777;
}

.arrow {
  color: #aaa;
}

.overlay-close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1001;
  border: none;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  color: var(--theme-color);
  cursor: pointer;
}
</style>