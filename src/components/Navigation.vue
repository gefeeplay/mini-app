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
        <span class="material-symbols-outlined">{{ item.icon }}</span>
        {{ item.text }}
      </button>
    </RouterLink>
  </div>
</template>

<style scoped>
    
</style>