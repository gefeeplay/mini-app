<script setup>
import { ref } from 'vue'

const props = defineProps({
    showEdit: { type: Boolean, default: false },
    tgUsername: { type: String }
})

const username = ref('')

const emit = defineEmits(['closeEdit', 'saveUser'])

const close = () => {
    emit('closeEdit')
}

const saveUserData = () => {
    emit('saveUser', username.value) // отправляем новое имя родителю
    close()
}
</script>

<template>
    <div class="modal-backdrop" v-if="showEdit" @click.self="close">
        <div class="modal">
            <div class="modal-title" style="text-align: center; margin: 0;">Смена данных</div>
            <input v-model="username" class="modal-text" type="text" placeholder="Сменить имя:"/>
            <!--<input class="modal-text" type="text" placeholder="Сменить аватарку:"/>-->
            <button @click="close" class="close-btn">
                <span class="material-symbols-outlined">close</span>
            </button>
            <button class="save-btn" @click="saveUserData">Сохранить</button>
        </div>
    </div>
</template>

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
    gap: 0.5rem;
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    max-width: 320px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    position: relative;
}

.modal-title {
    font-size: 1rem;
    color: var(--dark-color);
    padding-bottom: 0.5rem;
}

.modal-text {
    padding: 1rem;
    text-align: start;
    border: 1px solid var(--theme-color);
    border-radius: 5px;
}

.close-btn {
    color: var(--dark-color);
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
}

.close-btn:hover {
    color: rgb(22, 22, 24);
}

.save-btn {
    background: #0088cc;
    color: #fff;
    border: none;
    padding: 0.5rem 0.8rem;
    border-radius: 0.5rem;
    cursor: pointer;
    margin-top: 10px;
    font-size: small;
}

.save-btn:hover {
    background: #006fa8;
}
</style>