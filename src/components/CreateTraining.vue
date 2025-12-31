<script setup>
import { ref, reactive, computed, inject } from "vue";
import { useUserStore } from "../data/user.js";
import { createTraining } from "../api/workout.js";
import Loader from './exportComponents/Loader.vue'

const props = defineProps({
  show: Boolean,       // открыто ли окно
});

const emits = defineEmits(["close", "create"]);

const userStore = useUserStore();

// базовая форма тренировки
const trainingForm = reactive({
  tr_name: "",
  tr_sets: null,
  tr_count: null,
  tr_value: null,
  /*tr_measure: ""*/
});

const errorMessage = ref("");
const isLoading = ref(false)

const curTheme = inject('theme');
const loaderColor = computed(() => {
  return curTheme.theme.value == 'dark' ? '#ffffff' : '#333333'
})

const isFormValid = computed(() => {
  return (
    trainingForm.tr_name.trim() !== "" &&
    trainingForm.tr_sets > 0 &&
    trainingForm.tr_count > 0 &&
    trainingForm.tr_value > 0
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
      title: trainingForm.tr_name,
      exercises: [
        {
          name: trainingForm.tr_name,
          sets: trainingForm.tr_sets,
          reps: trainingForm.tr_count,
          weight: trainingForm.tr_value
        }
      ]
    };

    const token = userStore.getAccessToken();
    if (!token) return;

    const result = await createTraining(token, payload);

    alert(result);

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

</script>

<template>
  <div class="modal-backdrop" v-if="show" @click.self="close">
    <div class="modal">
      <div class="modal-title">Добавить тренировку</div>

      <div class="str">
        <label>Название:</label>
        <input 
        v-model="trainingForm.tr_name" 
        class="modal-text"
        :class="{ 'input-error': !trainingForm.tr_name && errorMessage }" 
        type="text" 
        placeholder="Моя тренировка" 
        />
      </div>
      <div class="str">
        <label>Подходов:</label>
        <input 
        v-model.number="trainingForm.tr_sets" 
        class="modal-text" 
        :class="{ 'input-error': !trainingForm.tr_name && errorMessage }" 
        type="number" 
        />
      </div>
      <div class="str">
        <label>За подход:</label>
        <input 
        v-model.number="trainingForm.tr_count" 
        class="modal-text" 
        :class="{ 'input-error': !trainingForm.tr_name && errorMessage }" 
        type="number" 
        />
      </div>
      <div class="str">
        <label>Нагрузка:</label>
        <input 
        v-model.number="trainingForm.tr_value" 
        class="modal-text" 
        :class="{ 'input-error': !trainingForm.tr_name && errorMessage }"
        type="number" 
        />
      </div>
      <!--
      <div class="str">
        <label>Единица измерения:</label>
        <input v-model="trainingForm.tr_measure" class="modal-text" type="text" placeholder="кг/л" />
      </div>
      -->
      <button class="close-btn" @click="close">
        <span class="material-symbols-outlined">close</span>
      </button>

      <div v-if="errorMessage" class="error-text">
        {{ errorMessage }}
      </div>

      <div v-if="isLoading" class="loader-wrapper">
        <Loader :color="loaderColor" :size="6" />
      </div>
      <button v-else class="save-btn" @click="saveTraining">
        Сохранить
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  gap: 0.5rem;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  max-width: 320px;
  width: 80%;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
}

.modal-title {
  font-size: 1rem;
  color: var(--dark-color);
  padding-bottom: 0.5rem;
}

.str {
  display: grid;
  grid-template-columns: 120px 1fr;
  width: 95%;
  align-items: center;
  gap: 0.5rem;
  text-align: left;
  color: var(--dark-color)
}

.modal-text {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0.5rem;
  border: 1px solid var(--dark-color);
  border-radius: 5px;
}

.close-btn {
  color: var(--dark-color);
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.save-btn {
  background: #0088cc;
  color: #fff;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 10px;
  font-size: small;
}

.save-btn:hover {
  background: #006fa8;
}

.error-text {
  margin-top: 5px;
  font-size: small;
  color: var(--light-red-color);
}

.loader-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80%;
  margin-top: 20px;
}

</style>
