<script setup>
import { ref } from 'vue'

const props = defineProps({
    showEdit: { type: Boolean, default: false },
    tgUsername: { type: String }
})

const username = ref('')
const avatarFile = ref(null);
const avatarPreview = ref(null);

const emit = defineEmits(['closeEdit', 'saveUser', 'saveAvatar']);

const close = () => {
    // Передаём аватарку и имя, если были изменения
    emit('saveUser', username.value);
    emit('saveAvatar', avatarFile.value);
    emit('closeEdit');
};

const saveUserData = () => {
    close()
}

const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    avatarFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);
};
</script>

<template>
    <div class="modal-backdrop" v-if="showEdit" @click.self="close">
        <div class="modal">
            <button @click="close" class="close-btn">
                <span class="material-symbols-outlined">close</span>
            </button>

            <h2 class="modal-title">Смена данных</h2>

            <!-- Имя -->
            <div class="input-group">
                <label>Новое имя</label>
                <input
                    v-model="username"
                    class="input"
                    type="text"
                    placeholder="Введите новое имя"
                />
            </div>

            <!-- Аватар -->
            <div class="avatar-upload">
                <label for="avatar-input" class="avatar-drop">
                    <div v-if="avatarPreview" class="avatar-preview">
                        <img :src="avatarPreview" alt="preview" />
                    </div>
                    <div v-else>
                        <span class="material-symbols-outlined upload-icon">cloud_upload</span>
                        <p>Загрузить аватарку</p>
                        <small>Нажмите или перетащите файл</small>
                    </div>
                </label>

                <input
                    id="avatar-input"
                    type="file"
                    class="file-input"
                    accept="image/*"
                    @change="onFileChange"
                />
            </div>

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
    bottom: 62px;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    z-index: 999;
}

.modal {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--not-theme-color);
    width: 100%;
    max-width: 480px;
    border-radius: 18px;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    animation: slideUp 0.25s ease;
}

@keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
}

.modal-title {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    color: var(--dark-color);
    font-weight: 600;
}

/* Кнопка закрытия */
.close-btn {
    position: absolute;
    top: 14px;
    right: 14px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    color: var(--whi-color);
}

.close-btn:hover {
    color: #000;
}

.modal-text {
    padding: 1rem;
    text-align: start;
    border: 1px solid var(--theme-color);
    border-radius: 5px;
    max-width: 200px;
}

/* Инпуты */
.input-group {
    text-align: left;
    width: 100%;
    margin-bottom: 15px;
}

.input-group label {
    display: block;
    margin-bottom: 4px;
    font-size: 0.85rem;
    color: var(--theme-color);
}

.input {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px;
    border: 1px solid #c7d4e2;
    border-radius: 10px;
    font-size: 0.95rem;
    transition: 0.25s;
    background: #f8f9fc;
}

.input:focus {
    outline: none;
    border-color: #0088cc;
    box-shadow: 0 0 0 3px rgba(0, 136, 204, 0.2);
    background: #fff;
}

/* Загрузка аватарки */
.avatar-upload {
    width: 100%;
    margin-bottom: 15px;
}

.avatar-drop {
    box-sizing: border-box;
    width: 100%;
    padding: 25px;
    border: 2px dashed #c7d4e2;
    border-radius: 16px;
    text-align: center;
    cursor: pointer;
    transition: 0.25s;
    background: #f8f9fc;
    color: #444;
    display: block;
}

.avatar-drop:hover {
    border-color: #0088cc;
    background: #eef8ff;
}

.avatar-preview {
    width: 100%;
    display: flex;
    justify-content: center;
}

.avatar-preview img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #0088cc;
}

.upload-icon {
    font-size: 40px;
    color: #0088cc;
}

.file-input {
    display: none;
}

/* Кнопка сохранения */
.save-btn {
    background: #0088cc;
    color: #fff;
    border: none;
    padding: 12px 0;
    width: 100%;
    border-radius: 12px;
    font-size: 1rem;
    cursor: pointer;
    transition: 0.25s;
    margin-top: 10px;
}

.save-btn:hover {
    background: #006fa8;
}
</style>