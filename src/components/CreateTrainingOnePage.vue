<script setup>
import { ref, reactive, computed, inject } from 'vue'
import { useUserStore } from '../data/user.js'
import { createTraining } from '../api/workout.js'
import Loader from './exportComponents/Loader.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'created'])

const userStore = useUserStore()

const trainingForm = reactive({
  title: '',
  exercises: [
    {
      name: '',
      sets: [{ reps: 0, weight: 0 }]
    }
  ]
})

const activeExerciseIndex = ref(0)
const isSaving = ref(false)
const errorMessage = ref('')

// Тема – для цвета лоадера
const curTheme = inject('theme', null)
const loaderColor = computed(() => {
  if (!curTheme) return '#333333'
  return curTheme.theme.value === 'dark' ? '#ffffff' : '#333333'
})

const currentExercise = computed(
  () => trainingForm.exercises[activeExerciseIndex.value]
)

function addExercise() {
  trainingForm.exercises.push({
    name: '',
    sets: [{ reps: 0, weight: 0 }]
  })
  activeExerciseIndex.value = trainingForm.exercises.length - 1
}

function removeExercise() {
  if (!confirm('Удалить упражнение?')) return

  const index = activeExerciseIndex.value

  trainingForm.exercises.splice(index, 1)

  if (activeExerciseIndex.value >= trainingForm.exercises.length) {
    activeExerciseIndex.value = trainingForm.exercises.length - 1
  }
}

function addSet(exIndex) {
  const ex = trainingForm.exercises[exIndex]
  if (!ex) return
  ex.sets.push({
    reps: 0,
    weight: ex.sets.length ? ex.sets[ex.sets.length - 1].weight : 0
  })
}

function removeSet(exIndex, setIndex) {
  const ex = trainingForm.exercises[exIndex]
  if (!ex) return
  if (ex.sets.length <= 1) return
  ex.sets.splice(setIndex, 1)
}

const isFormValid = computed(() => {
  if (!trainingForm.title.trim()) return false
  if (!trainingForm.exercises.length) return false

  return trainingForm.exercises.every(ex => {
    if (!ex.name.trim()) return false
    if (!ex.sets.length) return false
    return ex.sets.every(
      s => Number.isFinite(+s.reps) && Number.isFinite(+s.weight)
    )
  })
})

async function saveTraining() {
  if (!isFormValid.value) {
    errorMessage.value = 'Заполните все поля корректно'
    return
  }

  errorMessage.value = ''

  const payload = {
    title: trainingForm.title,
    exercises: trainingForm.exercises.map(ex => ({
      name: ex.name,
      sets: ex.sets.map(set => ({
        reps: Number(set.reps) || 0,
        weight: Number(set.weight) || 0
      }))
    }))
  }

  try {
    isSaving.value = true
    const token = userStore.getAccessToken()
    if (!token) {
      errorMessage.value = 'Не удалось получить токен пользователя'
      return
    }

    await createTraining(token, payload)
    alert('Ваша тренировка сохранена!')

    emit('created')
    emit('close')
  } catch (error) {
    errorMessage.value =
      error.response?.data?.detail || 'Ошибка при сохранении тренировки'
  } finally {
    isSaving.value = false
  }
}

function close() {
  emit('close')
}

// ----- Свайп для добавления упражнения -----
const showAddExerciseOverlay = ref(false)
const touchStartX = ref(0)
const touchEndX = ref(0)
const SWIPE_THRESHOLD = 100 //чувствительность

function onTouchStart(event) {
  if (!event.changedTouches?.length) return
  touchStartX.value = event.changedTouches[0].clientX
}

function onTouchEnd(event) {
  if (!event.changedTouches?.length) return
  touchEndX.value = event.changedTouches[0].clientX

  const deltaX = touchEndX.value - touchStartX.value

  // свайп справа налево
  if (deltaX < -SWIPE_THRESHOLD) {
    const lastIndex = trainingForm.exercises.length - 1

    // если это последнее упражнение — показываем добавление
    if (activeExerciseIndex.value === lastIndex) {
      showAddExerciseOverlay.value = true
    } else {
      // иначе переключаемся на следующее упражнение
      activeExerciseIndex.value += 1
    }

    return
  }

  // свайп слева направо — назад
  if (deltaX > SWIPE_THRESHOLD && activeExerciseIndex.value > 0) {
    activeExerciseIndex.value -= 1
  }
}

/*Правая подсказка*/
const hintText = computed(() => {
  const lastIndex = trainingForm.exercises.length - 1

  if (activeExerciseIndex.value === lastIndex) {
    return 'Новое упражнение'
  }

  return `Упражнение ${activeExerciseIndex.value + 2}`
})

/*Левая подсказка*/
const leftHintText = computed(() => {
  if (activeExerciseIndex.value === 0) return ''

  return `Упражнение ${activeExerciseIndex.value}`
})

const showLeftHint = computed(() => activeExerciseIndex.value > 0)

function confirmAddExercise() {
  showAddExerciseOverlay.value = false
  addExercise()
}

function cancelAddExercise() {
  showAddExerciseOverlay.value = false
}
</script>

<template>
  <div v-if="show" class="onepage-training" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
    <div class="header">
      <input v-model="trainingForm.title" class="training-title-input" placeholder="Название тренировки" />
      <button class="close-btn" type="button" @click="close">
        ×
      </button>
    </div>

    <!-- Индикаторы упражнений -->
    <div class="exercise-tabs" v-if="trainingForm.exercises.length">
      <button v-for="(ex, index) in trainingForm.exercises" :key="index" class="exercise-tab"
        :class="{ active: index === activeExerciseIndex }" @click="activeExerciseIndex = index">

      </button>
    </div>

    <!-- Карточка текущего упражнения -->
    <div v-if="currentExercise" class="exercise-card">
      <div class="exercise-header">
        <div class="exercise-caption">УПРАЖНЕНИЕ {{ activeExerciseIndex + 1 }}
          <!-- Кнопка удаления (только полседнее упражение)-->
          <button v-if="trainingForm.exercises.length > 1" class="exercise-remove-btn" type="button"
            @click="removeExercise">
            ×
          </button>
        </div>
        <input v-model="currentExercise.name" class="exercise-name-input" placeholder="Название" />

      </div>

      <div class="sets-header">
        <span>ПОДХОДЫ</span>
        <span>ПОВТ.</span>
        <span>ВЕС</span>
      </div>

      <div class="sets-list">
        <div v-for="(set, sIndex) in currentExercise.sets" :key="sIndex" class="set-row">
          <div class="set-index">
            {{ sIndex + 1 }}
          </div>
          <input v-model.number="set.reps" class="set-input" type="number" min="0" />
          <input v-model.number="set.weight" class="set-input" type="number" min="0" />
          <button class="set-remove" type="button" @click="removeSet(activeExerciseIndex, sIndex)"
            :disabled="currentExercise.sets.length <= 1">
            ×
          </button>
        </div>
      </div>

      <button class="add-set-btn" type="button" @click="addSet(activeExerciseIndex)">
        + Добавить подход
      </button>
    </div>

    <div v-if="errorMessage" class="error-text">
      {{ errorMessage }}
    </div>

    <!-- Боковые тени -->
    <div class="swipe-fade-left"></div>
    <div class="swipe-fade-right"></div>

    <!-- Подсказка: прошлое упражнение -->
    <div v-if="showLeftHint" class="prev-exercise-hint" @click="activeExerciseIndex -= 1">
      <span class="hint-text-left">
        {{ leftHintText }}
      </span>
    </div>

    <!-- Подсказка: добавление упражнения -->
    <div class="add-exercise-hint" @click="showAddExerciseOverlay = true">
      <span class="hint-text">
        {{ hintText }}
      </span>
    </div>

    <!-- Кнопка сохранить -->
    <Loader v-if="isSaving" :color="loaderColor" :size="6" class="loader-place" />
    <button v-else class="save-training-btn" type="button" :disabled="isSaving" @click="saveTraining">
      <span>Сохранить тренировку</span>
    </button>


    <!-- Оверлей добавления упражнения -->
    <transition name="fade">
      <div v-if="showAddExerciseOverlay" class="add-exercise-overlay" @click.self="cancelAddExercise">
        <div class="add-exercise-card" @click="confirmAddExercise">
          <div class="add-plus">+</div>
          <div class="add-text">ДОБАВИТЬ НОВОЕ УПРАЖНЕНИЕ</div>
        </div>

        <button class="overlay-close-btn" type="button" @click.stop="cancelAddExercise">
          ×
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.onepage-training {
  position: fixed;
  inset: 0;
  z-index: 1000;

  background: var(--not-theme-color, #f6f6fb);
  box-sizing: border-box;
  padding: 24px 24px 96px;

  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 64px);
}

.header {
  width: 100%;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.training-title-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 24px;
  font-weight: 700;
  color: var(--theme-color);
}

.training-title-input::placeholder {
  color: #cfd4e7;
}

.close-btn {
  background: transparent;
  font-size: 24px;
  color: #c0c4da;
  cursor: pointer;
}

.exercise-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-self: center;
}

.exercise-tab {
  width: 48px;
  height: 8px;
  border-radius: 999px;
  background: #e4e7f5;
  padding: 0;
}

.exercise-tab.active {
  background: #99bbfe;
}

.exercise-card {
  width: 90%;
  max-width: 350px;
  background: #ffffff;
  border-radius: 24px;
  padding: 20px 18px 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
}

.exercise-remove-btn {
  position: absolute;
  top: -4px;
  right: 4px;

  border: none;
  background: transparent;

  font-size: 24px;
  line-height: 1;

  color: #c0c4da;
  cursor: pointer;
}

.exercise-header {

  margin-bottom: 16px;
}

.exercise-caption {
  position: relative;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #a0a6c2;
  margin-bottom: 4px;
}

.exercise-name-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 600;
  color: #444444;
}

.exercise-name-input::placeholder {
  color: #cfd4e7;
}

.sets-header {
  display: grid;
  grid-template-columns: 20% 35% 35% 10%;
  font-size: 11px;
  color: #a0a6c2;
  margin-bottom: 8px;
  padding: 0 8px;
}

.sets-header span:last-child {
  text-align: center;
}

.sets-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.set-row {
  display: grid;
  grid-template-columns: 20% 35% 35% 10%;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.set-index {
  width: 32px;
  height: 32px;
  margin-left: 28px;
  border-radius: 50%;
  background: #99bbfe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
}

.set-input {
  height: 36px;
  border-radius: 18px;
  border: none;
  background: #f3f4fb;
  text-align: center;
  font-size: 14px;
  color: #222;
}

.set-input::-webkit-outer-spin-button,
.set-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.set-input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.set-remove {
  border: none;
  background: transparent;
  color: #abafc2;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.set-remove:disabled {
  opacity: 0.3;
  cursor: default;
}

.add-set-btn {
  margin-top: 16px;
  width: 90%;
  border-radius: 18px;
  border: 1px dashed #bdd0ff;
  background: #f6f7ff;
  color: #7d9bff;
  padding: 10px 12px;
  font-size: 13px;
}

.save-training-btn {
  position: fixed;
  left: 50%;
  bottom: 80px;
  transform: translateX(-50%);
  width: 80%;
  max-width: 350px;
  height: 52px;
  border-radius: 26px;
  background: #99bbfe;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  gap: 8px;
}

.loader-place {
  position: fixed;
  left: 50%;
  bottom: 100px;
}

.save-training-btn:disabled {
  opacity: 0.7;
}

.error-text {
  margin-top: 12px;
  font-size: 12px;
  color: #ff4d4f;
  text-align: center;
}

.add-exercise-overlay {
  position: fixed;
  inset: 0;
  background: var(--not-theme-color);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
}

.overlay-close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  color: #c0c4da;
  cursor: pointer;
}

.add-exercise-card {
  position: relative;
  width: 330px;
  height: 330px;
  border-radius: 24px;
  outline: 1px dashed #99bbfe;
  outline-offset: 4px;
  background: #fbfcff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #c8d5ff;
  text-align: center;
  font-size: 12px;
  letter-spacing: 0.08em;
}

.add-plus {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f1f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.add-text {
  max-width: 160px;
}

/* Правая подсказка*/
.add-exercise-hint,
.prev-exercise-hint {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 240px;

  display: flex;
  align-items: center;

  box-sizing: border-box;
  opacity: 0.55;
  transition: opacity 0.25s ease, transform 0.25s ease;

  z-index: 3;
}

.add-exercise-hint {
  right: 0;
  justify-content: end;
  padding-right: 8px;
}

.prev-exercise-hint {
  left: 0;
  justify-content: start;
  padding-left: 8px;
}

.hint-text,
.hint-text-left {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 11px;
  letter-spacing: 0.08em;
  font-weight: 500;
  color: #9ab4ff;
  user-select: none;
}

.hint-text {
  transform: rotate(180deg);
}

@keyframes hintFloat {
  0% {
    transform: translateY(-50%) translateX(0);
  }

  50% {
    transform: translateY(-50%) translateX(4px);
  }

  100% {
    transform: translateY(-50%) translateX(0);
  }
}

.add-exercise-hint {
  animation: hintFloat 2.8s ease-in-out infinite;
}

@keyframes hintFloatLeft {
  0% {
    transform: translateY(-50%) translateX(0);
  }

  50% {
    transform: translateY(-50%) translateX(-4px);
  }

  100% {
    transform: translateY(-50%) translateX(0);
  }
}

.add-exercise-hint:hover,
.prev-exercise-hint:hover {
  opacity: 0.9;
  transform: translateY(-50%) scale(1.05);
}

.prev-exercise-hint {
  animation: hintFloatLeft 2.8s ease-in-out infinite;
}

.add-exercise-hint:hover {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.swipe-fade-left,
.swipe-fade-right {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 30px;
  pointer-events: none;
  z-index: 2;
}

.swipe-fade-left {
  left: 0;
  background: linear-gradient(to right,
      var(--not-theme-color, #f6f6fb),
      rgba(246, 246, 251, 0));
}

.swipe-fade-right {
  right: 0;
  background: linear-gradient(to left,
      var(--not-theme-color, #f6f6fb),
      rgba(246, 246, 251, 0));
}
</style>
