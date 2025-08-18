<script setup>
</script>

<template>
  <div class="navigation">
    <button class="nav-item">
      <span class="material-symbols-outlined">
        menu
      </span>Лента
    </button>
    <button class="nav-item">
      <span class="material-symbols-outlined">
        directions_run
      </span>
      Тренировки
    </button>
    <button class="nav-item">
      <span class="material-symbols-outlined">
        chat
      </span>
      Друзья
    </button>
    <button class="nav-item">
      <span class="material-symbols-outlined">
        settings
      </span>
      Настройки
    </button>
  </div>
</template>

<style scoped>
.navigation {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;    
  justify-content: center;
  gap: 0.5rem; 
  color: white;
  background-color: rgb(115, 109, 196);
  padding: 0.5rem;
  min-height: 2rem;
  cursor: pointer;
}

button {
  all: unset;
}
</style>
