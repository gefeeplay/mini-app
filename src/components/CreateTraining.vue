<script setup>
import { reactive } from "vue";
import { useUserStore } from "../data/user.js";

const props = defineProps({
  show: Boolean,       // открыто ли окно
});

const emits = defineEmits(["close", "create"]);

const userStore = useUserStore();

// базовая форма тренировки
const trainingForm = reactive({
  tr_id: Date.now(),          // уникальный id
  usernameStr: userStore.username,
  tr_name: "",
  tr_sets: 0,
  tr_count: 0,
  tr_value: 0,
  tr_measure: ""
});

function close() {
  emits("close");
}

function saveTraining() {
  // добавить в стор
  userStore.addTraining({ ...trainingForm })
  close();
}
</script>

<template>
  <div class="modal-backdrop" v-if="show" @click.self="close">
    <div class="modal">
      <div class="modal-title">Добавить тренировку</div>

      <div class="str">
        <label>Название:</label>
        <input v-model="trainingForm.tr_name" class="modal-text" type="text" placeholder="Моя тренировка"/>
      </div>
      <div class="str">
        <label>Подходов:</label>
        <input v-model.number="trainingForm.tr_sets" class="modal-text" type="number"/>
      </div>
      <div class="str">
        <label>За подход:</label>
        <input v-model.number="trainingForm.tr_count" class="modal-text" type="number"/>
      </div>
      <div class="str">
        <label>Нагрузка:</label>
        <input v-model.number="trainingForm.tr_value" class="modal-text" type="number"/>
      </div>
      <div class="str">
        <label>Единица измерения:</label>
        <input v-model="trainingForm.tr_measure" class="modal-text" type="text" placeholder="кг/л" />
      </div>
      <button class="close-btn" @click="close">
        <span class="material-symbols-outlined">close</span>
      </button>

      <button class="save-btn" @click="saveTraining">Сохранить</button>
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
    width: 90%;
    align-items: center;
    gap: 0.5rem;
    text-align: left;
    
}
.modal-text {
  padding: 0.5rem;
  border: 1px solid var(--theme-color);
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
</style>
