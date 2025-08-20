import { ref, computed, provide, inject } from 'vue'

// Создаём символ для уникального ключа
const TelegramSymbol = Symbol()

export function provideTelegram() {
  const userData = ref(null)
  const theme = ref('light')
  const tg = ref(null)

  if (window.Telegram?.WebApp) {
    tg.value = window.Telegram.WebApp
    tg.value.expand() // Раскрываем на весь экран
    userData.value = tg.value.initDataUnsafe?.user
    theme.value = tg.value.colorScheme
  }

  const userPhoto = computed(() => userData.value?.photo_url || null)

  provide(TelegramSymbol, {
    userData,
    theme,
    tg,
    userPhoto
  })
}

export function useTelegram() {
  const telegram = inject(TelegramSymbol)
  if (!telegram) throw new Error('Telegram state not provided!')
  return telegram
}