<script setup>
import { useUserStore } from '../data/user'
import { ref, onMounted, computed } from 'vue'
import { useTelegram } from '../composables/useTelegram'
import SearchInput from './exportComponents/SearchInput.vue'

const userStore = useUserStore()
const { userData, userPhoto } = useTelegram()

const tgUsername = ref(userData.value ? userData.value.username : 'Неизвестный')

onMounted(() => {
    userStore.loadUsername()
})

const myTrainings = computed(() =>
  userStore.trainingsWithUsername.filter(t => t.usernameStr === userStore.username)
)

</script>

<template>
    <div class="title">
        Тренировки
    </div>
    <div class="input">
        <SearchInput />
    </div>
    <div class="def-text">
        Мои тренировки:
    </div>
    <div class="tr-list">
        <div class="tr-create tr-item">
            Добавить тренировку
            <span class="material-symbols-outlined">add_circle</span>
        </div>
        <div class="tr-item" v-for="item in myTrainings" :key="item.tr_id">
            <div class="tr-title tr-line">
                <div class="user-block">
                    <img v-if="userPhoto" class="user-photo" :src="userPhoto">
                    <div v-else class="avatar-placeholder"></div>
                    <div v-if="userStore.username">{{ item.usernameStr }}</div>
                    <div v-else>{{ tgUsername }}</div>
                </div>
                <div>{{ item.tr_name }}</div>
            </div>
            <div class="tr-body">
                <div class="tr-line">
                    <div><img src="../assets\sort-numeric-alt-up-svgrepo-com.svg"
                            style="height: 0.8rem;" />Подходов:</div>
                    <div>{{ item.tr_sets }}</div>
                </div>
                <div class="tr-line">
                    <div><img src="../assets\sort-numeric-alt-up-svgrepo-com.svg" style="height: 0.8rem;" />За
                        подход:</div>
                    <div>{{ item.tr_count }}</div>
                </div>
                <div class="tr-line">
                    <div><img src="../assets/dumbbell-svgrepo-com.svg" style="height: 0.8rem;" />Рабочий вес/объем:
                    </div>
                    <div>{{ item.tr_value }}{{ item.tr_measure }}</div>
                </div>
                <div class="tr-line">
                    <div><img src="../assets/calculate-1-svgrepo-com.svg" style="height: 0.8rem;" />Общее
                        количество:</div>
                    <div>{{ item.tr_sets * item.tr_count }}</div>
                </div>
            </div>
            <div class="tr-btns">
                <button class="edit"><span class="material-symbols-outlined" style="color: var(--dark-color)">edit</span></button>
                <button class="edit"><span class="material-symbols-outlined" style="color: var(--red-color)">delete</span></button>
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
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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

.tr-btns {
    display: flex;
    justify-content: end;
    gap: 0.5rem;
    cursor: pointer;
    margin-top: 0.5rem;
}

.tr-create {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1rem;
    color: #333;
    
}

.tr-create .material-symbols-outlined {
    font-size: 24px;  
}
</style>