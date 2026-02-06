<script setup>
import { defineProps, defineEmits } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps({
    modelValue: {
        type: String,
        required: true // 'cardio' | 'strength'
    },
    show: Boolean
});

const emit = defineEmits(["update:modelValue", "close"]);

const types = [
    {
        value: "cardio",
        label: "Кардио тренировка",
        icon: "tabler:bike"
    },
    {
        value: "strength",
        label: "Силовая тренировка",
        icon: "lucide:biceps-flexed"
    }
];

function selectType(type) {
    emit("update:modelValue", type);
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

                    <h3 class="title">Выберите тип тренировки</h3>

                    <div class="list">
                        <button v-for="item in types" :key="item.value" class="item" @click="selectType(item.value)">
                            <span class="label">{{ item.label }}</span>
                            <span class="icon-wrap" :class="{ active: item.value === modelValue }">
                                <Icon :icon="item.icon" width="24" height="24" />
                            </span>
                        </button>
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
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f6f6fb;
    border-radius: 24px;
    padding: 20px;
}

.title {
    font-size: 16px;
    margin-bottom: 16px;
}

.list {
    display: flex;
    flex-direction: column;
    width: 90%;
    gap: 12px;
    margin-bottom: 24px;
}

.item {
    background: #fff;
    border-radius: 20px;
    padding: 14px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: none;
    cursor: pointer;
}

.icon-wrap.active {
    background: #99BBFE;
    color: white;
}

.label {
    font-size: 14px;
}

.icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #F3F2F8;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000000;
}

.save-btn {
    padding: 14px;
    border-radius: 20px;
    font-size: 16px;
}
</style>