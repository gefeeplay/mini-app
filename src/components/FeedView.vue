<script setup>

</script>

<template>
    <div class="title">
      <div v-if="userData">Добро пожаловать, {{ userData.username }}</div>
      <div v-else="userData">Добро пожаловать, пользователь</div>
    </div>
    <div>
        Лента
    </div>
</template>

<style scoped>
    
</style>