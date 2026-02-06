<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    show: Boolean
});

const emit = defineEmits(["update:modelValue", "close"]);

const colors = [
    "#9b8cff", "#c77dff", "#f1a7ff", "#ff9ecd", "#ffadad", "#ff6b6b",
    "#ffb703", "#ffbe6f", "#ffe11a", "#9ef01a", "#00d2b8", "#9bbcff"
];

function selectColor(color) {
    emit("update:modelValue", color);
}

function close() {
    emit("close");
}
</script>

<template>
    <Teleport to="body">
        <Transition name="overlay-fade">
        <div v-if="show" class="overlay" @click.self="close">
            <div class="sheet">

                <h3 class="title">Цвет тренировки</h3>

                <div class="colors">
                    <button v-for="color in colors" :key="color" class="color" :style="{ background: color }"
                        :class="{ active: color === modelValue }" @click="selectColor(color)" />
                </div>

                <button class="submit-btn save-btn" @click="close">
                    Сохранить
                </button>

            </div>
        </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: center;
}

.sheet {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    background: #f6f6fb;
    border-radius: 24px;
    padding: 20px;
}

.title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
}

.colors {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 14px;
    margin-bottom: 24px;
}

.color {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
}

.color.active {
    outline: 2px solid #99BBFE;
    outline-offset: 2px;
}

.save-btn {
    padding: 14px;
    border-radius: 20px;
    font-size: 16px;
}
</style>