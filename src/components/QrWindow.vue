<template>
  <div v-if="show" class="modal-backdrop" @click.self="close">
    <div class="modal">
      <h2 class="modal-title">QR-код приложения</h2>
      <qrcode-vue :value="appLink" :size="200" class="qr" />
      <p class="modal-text">{{ appLink }}</p>
      <button class="copy-btn" @click="copyLink">{{ copyText }}</button>
      <button @click="close" class="close-btn"><span class="material-symbols-outlined">close</span></button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import QrcodeVue from 'qrcode.vue'

const props = defineProps({
  botUsername: { type: String, required: true }, // имя бота
  show: { type: Boolean, default: false }        // видимость окна
})

const emit = defineEmits(['close'])

const appLink = computed(() => `https://t.me/${props.botUsername}/startapp`)
const copied = ref(false)
const copyText = computed(() => copied.value ? 'Скопировано' : 'Скопировать')

const close = () => {
  emit('close')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(appLink.value)
    copied.value = true
    console.log(copied.value)
    setTimeout(() => copied.value = false, 5000) 
  } catch (err) {
    console.error('Не удалось скопировать ссылку', err)
  }
}

</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  display: flex;
  flex-direction: column;
  align-items: center;  
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  max-width: 320px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  position: relative;
}

.modal-title {
  font-size: 1rem;
  margin: 0 0 15px 0;
}

.qr {
  margin: 10px auto;
}

.modal-text {
  font-size: 0.8rem;
  color: #666;
  margin: 10px 0;
  word-break: break-all;
}

.close-btn {
  position: absolute;
  top: 10px;   
  right: 10px; 
  cursor: pointer;
}

.close-btn:hover{
    color: rgb(22, 22, 24);
}
.copy-btn {
  background: #0088cc;
  color: #fff;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 10px;
  font-size: small;
}
.copy-btn:hover {
  background: #006fa8;
}
</style>
