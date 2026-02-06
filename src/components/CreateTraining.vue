<script setup>
import { ref, reactive, computed, inject, watch, nextTick } from "vue";
import { useUserStore } from "../data/user.js";
import { createTraining } from "../api/workout.js";
import Loader from './exportComponents/Loader.vue'
import ChooseColor from "./ChooseColor.vue";
import ChooseType from "./ChooseType.vue";
import CreateSets from "./CreateSets.vue";
import { Icon } from "@iconify/vue";
import { color } from "motion-v";

const props = defineProps({
  show: Boolean,       // открыто ли окно
});

const emits = defineEmits(["close", "create"]);

const userStore = useUserStore();

const trainingForm = reactive({
  title: "",

  color: "#ffb800",

  type: "cardio", // cardio | strength

  date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD

  exercises: [
    {
      name: "",
      sets: [
        { reps: 0, weight: 0 }
      ]
    }
  ]
});

//Цвет
const trainingColor = computed(() => trainingForm.color);
const showColorModal = ref(false);

//Тип
const showTypeModal = ref(false);
const trainingTypeLabel = computed(() => {
  return trainingForm.type === "cardio"
    ? "Кардио тренировка"
    : "Силовая тренировка";
});

//Иконка (от типа)
const trainingTypeIcon = computed(() => {
  return trainingForm.type === "cardio"
    ? "tabler:bike"
    : "lucide:biceps-flexed";
});

//Дата
const dateInput = ref(null);
const today = new Date().toISOString().slice(0, 10);
function openDate() {
  dateInput.value?.showPicker();
}

const formattedDate = computed(() => {
  const [y, m, d] = trainingForm.date.split("-");
  return `${d}.${m}.${y}`;
});

//Сеты
const showSetsModal = ref(false);
const currentSets = computed(() => {
  return trainingForm.exercises[0]?.sets ?? []
})
const setsPreview = computed(() => {
  const sets = currentSets.value
  if (!sets.length) return '—'

  const repsList = sets.map(s => s.reps).join('-')
  return `${sets.length} | ${repsList}`
})

const errorMessage = ref("");
const isLoading = ref(false)

const curTheme = inject('theme');
const loaderColor = computed(() => {
  return curTheme.theme.value == 'dark' ? '#ffffff' : '#333333'
})

const isFormValid = computed(() => {
  return (
    trainingForm.title.trim() !== "" &&
    trainingForm.exercises.length > 0 &&
    trainingForm.exercises[0].name.trim() !== ""
  );
});

async function saveTraining() {
  if (!isFormValid.value) {
    errorMessage.value = "Заполните все поля корректно";
    return;
  }

  errorMessage.value = "";

  try {
    // Устанавливаем состояние загрузки
    isLoading.value = true

    const payload = {
      title: trainingForm.title,
      /*Нет на сервере
      type: trainingForm.type,   
      date: trainingForm.date,
      */

      exercises: trainingForm.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets.map(set => ({
          reps: set.reps,
          weight: set.weight
        }))
      }))
    };


    const token = userStore.getAccessToken();
    if (!token) return;

    const result = await createTraining(token, payload);

    if (result) { alert("Ваша тренировка сохранена!"); }

    emits("create");
    emits("close");
  } catch (error) {
    errorMessage.value =
      error.response?.data?.detail || "Ошибка при сохранении тренировки";
  } finally {
    isLoading.value = false
  }
}

function close() {
  emits("close");
}

// Для фокуса на названии
const titleInput = ref(null);
watch(
  () => props.show,
  async (val) => {
    if (val) {
      await nextTick();
      titleInput.value?.focus();
    }
  }
);

</script>

<template>
  <div v-if="show" class="create-training">

    <div class="header">
      <div class="subtitle">Новая тренировка</div>
      <input ref="titleInput" v-model="trainingForm.title" class="title-input" :style="{
        color: trainingForm.title ? trainingColor : trainingColor,
        '--placeholder-color': trainingColor
      }" placeholder="Название тренировки" />
    </div>

    <ChooseColor v-model="trainingForm.color" :show="showColorModal" @close="showColorModal = false" />

    <div class="form">
      <div class="form-row">
        <span class="label">Цвет</span>
        <span class="color-dot" :style="{ background: trainingColor }" @click="showColorModal = true"></span>
      </div>

      <div class="form-row">
        <span class="label">Вид тренировки</span>
        <div style="display: flex; flex-direction: row; gap: 8px;">
          <div class="right-small">
            <Icon :icon="trainingTypeIcon" width="24" height="24" class="icon" />
          </div>
          <div class="right-small" @click="showTypeModal = true">
            <Icon icon="weui:arrow-filled" width="12" height="24" class="icon" />
          </div>
        </div>
      </div>

      <ChooseType v-model="trainingForm.type" :show="showTypeModal" @close="showTypeModal = false" />

      <div class="form-row">
        <span class="label">Сеты</span>
        <div class="right value" @click="showSetsModal = true">
          {{ setsPreview }}
        </div>
      </div>

      <CreateSets :show="showSetsModal" :exercise="trainingForm.exercises[0]" :trainingName="trainingForm.title"
        :trainingColor="trainingForm.color" @update:exercise="trainingForm.exercises[0] = $event"
        @close="showSetsModal = false" />

      <div class="form-row" @click="openDate">
        <span class="label">Дата</span>
        <div class="right value">
          <input ref="dateInput" type="date" v-model="trainingForm.date" class="date-input hidden-date" />
          <span class="value">{{ formattedDate }}</span>
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="error-text">
      {{ errorMessage }}
    </div>

    <button class="submit-btn add-training" :disabled="isLoading" @click="saveTraining">
      <Loader v-if="isLoading" :color="loaderColor" :size="6" />
      <span v-else>Добавить запись</span>
    </button>

  </div>
</template>


<style scoped>
.create-training {
  position: fixed;
  inset: 0;
  z-index: 1000;

  background: var(--not-theme-color);
  box-sizing: border-box;
  padding: 16px;

  display: flex;
  flex-direction: column;
  align-items: center;

  height: calc(100vh - 64px);
}

.header {
  margin-bottom: 20px;
}

.subtitle {
  text-align: start;
  font-weight: 600;
  margin-bottom: 6px;
}

.title-input {
  width: 100%;
  font-size: 32px;
  font-weight: 700;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
}

.title-input::placeholder {
  color: var(--placeholder-color);
}

.form {
  width: 95%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row {
  background: #ffffff;
  height: 50px;
  border-radius: 25px;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: #222;
}

.right {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  background-color: #F3F2F8;
  border-radius: 20px;
  padding: 14px 16px;
}

.right-small {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F3F2F8;
  border-radius: 20px;
  height: 40px;
  width: 40px;
}

.value {
  font-size: 13px;
  color: #777;
}

.space-between {
  justify-content: space-between;
}

.color-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ffb800;
}

.icon {
  font-size: 20px;
  color: #555;
}

.arrow {
  font-size: 22px;
  color: #bbb;
}

.add-training {
  height: 50px;
  margin-top: auto;
  margin-bottom: 8px;
  width: 80%;
  background: #99BBFE;
  border: none;
  border-radius: 25px;
  padding: 14px;
  font-size: 14px;
}

.error-text {
  margin-top: 10px;
  font-size: 12px;
  color: #ff4d4f;
  text-align: center;
}

.hidden-date {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
</style>
