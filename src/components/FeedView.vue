<script setup>
import { ref, onMounted, computed} from 'vue'
import { useTelegram } from '../composables/useTelegram'
import SearchInput from './exportComponents/SearchInput.vue'

const { userData, userPhoto } = useTelegram()

const tgUsername = ref(userData.value ? userData.value.username : 'Неизвестный')
const username = ref('')
const trainings = ref([
  {
    tr_id: 1,
    username: username,
    tr_name: 'Пиво с утреца',
    tr_sets: 5,
    tr_count: 1,
    tr_value: 1,
    tr_measure: 'л'
  },
  {
    tr_id: 2,
    username: 'User2',
    tr_name: 'Пиво с утреца',
    tr_sets: 5,
    tr_count: 2,
    tr_value: 1,
    tr_measure: 'л'
  },
  {
    tr_id: 3,
    username: 'User3',
    tr_name: 'Пиво с утреца',
    tr_sets: 5,
    tr_count: 3,
    tr_value: 1,
    tr_measure: 'л'
  },
  {
    tr_id: 4,
    username: username,
    tr_name: 'Пиво с утреца',
    tr_sets: 5,
    tr_count: 4,
    tr_value: 1,
    tr_measure: 'л'
  },
  {
    tr_id: 5,
    username: username,
    tr_name: 'Пиво с утреца',
    tr_sets: 5,
    tr_count: 6,
    tr_value: 1,
    tr_measure: 'л'
  },
  {
    tr_id: 6,
    username: username,
    tr_name: 'Пиво с утреца',
    tr_sets: 5,
    tr_count: 6,
    tr_value: 1,
    tr_measure: 'л'
  },
  {
    tr_id: 7,
    username: username,
    tr_name: 'Пиво с утреца',
    tr_sets: 5,
    tr_count: 7,
    tr_value: 1,
    tr_measure: 'л'
  }
]);

onMounted(() => {
  const savedName = localStorage.getItem('username')
  if (savedName) {
    username.value = savedName
  }
})

</script>

<template>
    <div class="title">
      <div v-if="username">Добро пожаловать, {{ username }}</div>
      <div v-else-if="tgUsername">Добро пожаловать, {{ tgUsername }}</div>
      <div v-else>Добро пожаловать, пользователь</div>
    </div>
    <div>
        Лента
    </div>
    <div class="input">
      <SearchInput/> 
    </div>
    <div class="tr-list">
      <div class="tr-item" v-for="item in trainings">
        <div class="tr-title tr-line">
          <div class="user-block">
            <img v-if="userPhoto" class="user-photo":src="userPhoto">
            <div class="avatar-placeholder" v-else></div>
            <div v-if="username">{{ item.username }}</div>
            <!--<div v-else="tgUsername">{{ tgUsername }}</div>-->
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
.title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 1rem;
  text-align: center;
  color: var(--theme-color, #0088cc);
}

.input {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
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

.tr-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}

.tr-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.6rem;
  color: #333;
  border-bottom: 1px solid #eee;
  padding: 0 1rem 0.4rem 0;
  /*padding-bottom: 0.4rem;*/
  width: 100%;
}

.tr-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 1rem;
  font-size: 0.9rem;
  color: #555;
  text-align: justify;
}

.tr-line{
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-block {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-photo {
  width: 1.5rem;
  height: 1.5rem;
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
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: #007aff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>
