<script setup>
import { Icon } from '@iconify/vue';

const navItems = [
  { to: '/', icon: 'fluent:home-24-filled', text: 'Лента' },
  { to: '/training', icon: 'lets-icons:chart-alt-fill', text: 'Тренировки' },
  { to: '/friends', icon: 'fa7-solid:users', text: 'Друзья' },
  { to: '/settings', icon: 'majesticons:settings-cog', text: 'Настройки' },
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
        <Icon 
          :icon="item.icon" 
          width="28" 
          class="nav-icon"
          :class="{ active: isActive }"
        />

        <span class="nav-text">{{ item.text }}</span>

      </button>
    </RouterLink>
  </div>
</template>

<style scoped>
/* Иконки */
.nav-icon {
  transition: color 0.2s ease, transform 0.2s ease;
  color: #9fa5ac; /* неактивная */
}

.nav-icon.active {
  color:  #48c78e; /* подсветка активной страницы */
  transform: scale(1.15);
}

</style>