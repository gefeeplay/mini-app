<template>
    <span class="loader" :style="loaderStyle"></span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Основной цвет лоадера
  color: {
    type: String,
    default: '#6A80F6' // или 'rgb(138, 157, 255)'
  },
  // Размер лоадера
  size: {
    type: Number,
    default: 10 // font-size в px
  }
})

// Генерируем CSS переменные для анимации
const loaderStyle = computed(() => {
  // Извлекаем значения RGB из цвета
  let r = 106, g = 128, b = 246 // значения по умолчанию
  
  if (props.color.startsWith('rgb')) {
    // Парсим rgb(r, g, b) или rgba(r, g, b, a)
    const match = props.color.match(/\d+/g)
    if (match && match.length >= 3) {
      r = parseInt(match[0])
      g = parseInt(match[1])
      b = parseInt(match[2])
    }
  } else if (props.color.startsWith('#')) {
    // Парсим hex цвет
    const hex = props.color.replace('#', '')
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16)
      g = parseInt(hex[1] + hex[1], 16)
      b = parseInt(hex[2] + hex[2], 16)
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
    }
  }
  
  return {
    '--loader-color': props.color,
    '--loader-color-20': `rgba(${r}, ${g}, ${b}, 0.2)`,
    '--loader-color-50': `rgba(${r}, ${g}, ${b}, 0.5)`,
    '--loader-color-70': `rgba(${r}, ${g}, ${b}, 0.7)`,
    '--loader-size': `${props.size}px`
  }
})
</script>

<style scoped>
.loader {
  font-size: var(--loader-size, 10px);
  width: 1em;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: mulShdSpin 1.1s infinite ease;
  transform: translateZ(0);
}

@keyframes mulShdSpin {
  0%,
  100% {
    box-shadow: 
      0em -2.6em 0em 0em var(--loader-color),
      1.8em -1.8em 0 0em var(--loader-color-20),
      2.5em 0em 0 0em var(--loader-color-20),
      1.75em 1.75em 0 0em var(--loader-color-20),
      0em 2.5em 0 0em var(--loader-color-20),
      -1.8em 1.8em 0 0em var(--loader-color-20),
      -2.6em 0em 0 0em var(--loader-color-50),
      -1.8em -1.8em 0 0em var(--loader-color-70);
  }
  12.5% {
    box-shadow: 
      0em -2.6em 0em 0em var(--loader-color-70),
      1.8em -1.8em 0 0em var(--loader-color),
      2.5em 0em 0 0em var(--loader-color-20),
      1.75em 1.75em 0 0em var(--loader-color-20),
      0em 2.5em 0 0em var(--loader-color-20),
      -1.8em 1.8em 0 0em var(--loader-color-20),
      -2.6em 0em 0 0em var(--loader-color-20),
      -1.8em -1.8em 0 0em var(--loader-color-50);
  }
  25% {
    box-shadow: 
      0em -2.6em 0em 0em var(--loader-color-50),
      1.8em -1.8em 0 0em var(--loader-color-70),
      2.5em 0em 0 0em var(--loader-color),
      1.75em 1.75em 0 0em var(--loader-color-20),
      0em 2.5em 0 0em var(--loader-color-20),
      -1.8em 1.8em 0 0em var(--loader-color-20),
      -2.6em 0em 0 0em var(--loader-color-20),
      -1.8em -1.8em 0 0em var(--loader-color-20);
  }
  37.5% {
    box-shadow: 
      0em -2.6em 0em 0em var(--loader-color-20),
      1.8em -1.8em 0 0em var(--loader-color-50),
      2.5em 0em 0 0em var(--loader-color-70),
      1.75em 1.75em 0 0em var(--loader-color),
      0em 2.5em 0 0em var(--loader-color-20),
      -1.8em 1.8em 0 0em var(--loader-color-20),
      -2.6em 0em 0 0em var(--loader-color-20),
      -1.8em -1.8em 0 0em var(--loader-color-20);
  }
  50% {
    box-shadow: 
      0em -2.6em 0em 0em var(--loader-color-20),
      1.8em -1.8em 0 0em var(--loader-color-20),
      2.5em 0em 0 0em var(--loader-color-50),
      1.75em 1.75em 0 0em var(--loader-color-70),
      0em 2.5em 0 0em var(--loader-color),
      -1.8em 1.8em 0 0em var(--loader-color-20),
      -2.6em 0em 0 0em var(--loader-color-20),
      -1.8em -1.8em 0 0em var(--loader-color-20);
  }
  62.5% {
    box-shadow: 
      0em -2.6em 0em 0em var(--loader-color-20),
      1.8em -1.8em 0 0em var(--loader-color-20),
      2.5em 0em 0 0em var(--loader-color-20),
      1.75em 1.75em 0 0em var(--loader-color-50),
      0em 2.5em 0 0em var(--loader-color-70),
      -1.8em 1.8em 0 0em var(--loader-color),
      -2.6em 0em 0 0em var(--loader-color-20),
      -1.8em -1.8em 0 0em var(--loader-color-20);
  }
  75% {
    box-shadow: 
      0em -2.6em 0em 0em var(--loader-color-20),
      1.8em -1.8em 0 0em var(--loader-color-20),
      2.5em 0em 0 0em var(--loader-color-20),
      1.75em 1.75em 0 0em var(--loader-color-20),
      0em 2.5em 0 0em var(--loader-color-50),
      -1.8em 1.8em 0 0em var(--loader-color-70),
      -2.6em 0em 0 0em var(--loader-color),
      -1.8em -1.8em 0 0em var(--loader-color-20);
  }
  87.5% {
    box-shadow: 
      0em -2.6em 0em 0em var(--loader-color-20),
      1.8em -1.8em 0 0em var(--loader-color-20),
      2.5em 0em 0 0em var(--loader-color-20),
      1.75em 1.75em 0 0em var(--loader-color-20),
      0em 2.5em 0 0em var(--loader-color-20),
      -1.8em 1.8em 0 0em var(--loader-color-50),
      -2.6em 0em 0 0em var(--loader-color-70),
      -1.8em -1.8em 0 0em var(--loader-color);
  }
}
</style>