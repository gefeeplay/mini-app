<script setup>
  const navItems = [
  { to: '/', icon: 'menu', text: 'Лента' },
  { to: '/training', icon: 'directions_run', text: 'Тренировки' },
  { to: '/friends', icon: 'chat', text: 'Друзья' },
  { to: '/settings', icon: 'settings', text: 'Настройки' },
]
</script>

<template>
    <div class="navigation nav-text">
    <RouterLink 
      v-for="item in navItems" 
      :key="item.to" 
      :to="item.to" 
      custom 
      v-slot="{ navigate, isActive }"
    >
      <button 
        class="nav-item" 
        @click="navigate"
        :class="{ active: isActive }"
      >
        <span class="material-symbols-outlined"
        :class="{ active: isActive }"
        >{{ item.icon }}</span>
        <span class="nav-text">{{ item.text }}</span>
      </button>
    </RouterLink>
  </div>
</template>

<style scoped>
/* Иконки */
.material-symbols-outlined {
  transition: color 0.2s ease, transform 0.2s ease;
}

/* Активная иконка */
.material-symbols-outlined.active {
  color: #48c78e; /* светло-зеленая иконка */
  transform: scale(1.15);
}

</style>