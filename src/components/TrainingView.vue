<script setup>
import { ref } from 'vue';
import { useTelegram } from '../composables/useTelegram'
import SearchInput from './exportComponents/SearchInput.vue';

const { userData, userPhoto } = useTelegram()
const tgUsername = ref(userData.value ? userData.value.username : 'Неизвестный')

</script>

<template>
  <div class="title">
      Тренировки
  </div>
  <div class="input">
      <SearchInput/>
  </div>
  <div class="def-text">
      Мои тренировки:
  </div>
  <div class="tr-list">
      <div class="tr-item" v-for="item in trainings">
        <div class="tr-title tr-line">
          <div class="user-block">
            <img v-if="userPhoto" class="user-photo":src="userPhoto">
            <div class="avatar-placeholder" v-else></div>
            <div v-if="username">{{ username }}</div>
            <div v-else>{{ tgUsername }}</div>
          </div>
          <div>{{ item.tr_name }}</div>
        </div>
        <div class="tr-body">
          <div class="tr-line">
            <div><img src="../assets\sort-numeric-alt-up-svgrepo-com.svg" style="height: 0.8rem;"/>Подходов:</div>
            <div>{{ item.tr_sets }}</div>
          </div>
          <div class="tr-line">
            <div><img src="../assets\sort-numeric-alt-up-svgrepo-com.svg" style="height: 0.8rem;"/>За подход:</div>
            <div>{{ item.tr_count }}</div>
          </div>
          <div class="tr-line">
            <div><img src="../assets/dumbbell-svgrepo-com.svg" style="height: 0.8rem;"/>Рабочий вес/объем:</div>
            <div>{{ item.tr_value }}{{ item.tr_measure }}</div>
          </div>
          <div class="tr-line">
            <div><img src="../assets/calculate-1-svgrepo-com.svg" style="height: 0.8rem;"/>Общее количество:</div>
            <div>{{ item.tr_sets * item.tr_count }}</div>
          </div>
        </div>
      </div>
    </div>
</template>


<style scoped>
.input {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
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

.tr-item {
  background: #fff;
  border-radius: 1rem;
  padding: 1rem 1.2rem;
  width: 80%;
  max-width: 400px;

  /* тень для объема */
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
</style>