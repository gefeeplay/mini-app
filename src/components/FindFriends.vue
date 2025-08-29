<script setup>
import SearchInput from './exportComponents/SearchInput.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

function goBack() {
  router.push('/friends')
}
</script>

<template>
  <div class="header">
    <button class="back-btn" @click="goBack">
      <span class="material-symbols-outlined">arrow_back</span>
    </button>
    <div class="title find-friend-title">Поиск друзей</div>
  </div>
  <div class="search-input">
      <SearchInput/>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1rem;
}

.find-friend-title{
   flex-grow: 1;
}

</style>