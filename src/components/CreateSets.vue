<script setup>
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
    show: Boolean,

    exercise: {
        type: Object,
        default: () => ({
            name: '',
            sets: []
        })
    },
    trainingName: String,
    trainingColor: String
})

const emit = defineEmits([
    'close',
    'update:sets'
])

const isBodyWeight = ref(false)
const MAX_SETS = 10;
const localExercise = ref({
    name: '',
    sets: []
})
const canAddSet = computed(() => localExercise.value.sets.length < MAX_SETS)

watch(
    () => props.show,
    (val) => {
        if (!val) return

        localExercise.value = props.exercise?.sets?.length
            ? JSON.parse(JSON.stringify(props.exercise))
            : {
                name: props.exercise?.name || '',
                sets: [{ reps: 0, weight: 0 }]
            }

        isBodyWeight.value = localExercise.value.sets.every(s => s.weight === 0)
    }
)

function addSet() {
    if (!canAddSet.value) return

    localExercise.value.sets.push({
        reps: 0,
        weight: isBodyWeight.value
            ? 0
            : localExercise.value.sets.at(-1)?.weight || 0
    })
}

function save() {
    if (isBodyWeight.value) {
        localExercise.value.sets.forEach(s => (s.weight = 0))
    }

    emit('update:exercise', localExercise.value)
    emit('close')
}

function close() {
    emit('close')
}
</script>

<template>
    <Teleport to="body">
        <Transition name="overlay-fade">
            <div v-if="show" class="overlay" @click.self="close">
                <div class="sheet">
                    <!-- Header -->
                    <div class="header">
                        <input v-model="localExercise.name" class="train-title"
                            :style="{ color: trainingColor, '--placeholder-color': trainingColor }"
                            placeholder="Название упражнения" />

                        <div class="actions">
                            <label class="switch">
                                <span>Свой вес</span>
                                <input type="checkbox" v-model="isBodyWeight" />
                                <span class="slider" />
                            </label>
                        </div>
                    </div>

                    <div class="table-head" :class="{ twoCols: isBodyWeight }">
                        <span>Сет</span>
                        <span>Повторения</span>
                        <span v-if="!isBodyWeight">Вес</span>
                    </div>

                    <div class="rows">
                        <div v-for="(set, index) in localExercise.sets" :key="index" class="row">
                            <div class="index">{{ index + 1 }}</div>

                            <input type="number" v-model.number="set.reps" placeholder="0" />

                            <input v-if="!isBodyWeight" type="number" v-model.number="set.weight" placeholder="кг" />
                        </div>
                    </div>

                    <button class="add-set" :class="{ disabled: !canAddSet }" :disabled="!canAddSet" @click="addSet">
                        {{ canAddSet ? 'Добавить сет' : 'Достигнут лимит сетов' }}
                    </button>

                    <button class="submit-btn save-btn" @click="save">
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

.save-btn {
    padding: 14px;
    border-radius: 20px;
    font-size: 16px;
    margin-top: 10px;
}

.add-set {
    margin: 20px 0;
    width: 80%;
    background: white;
    color: #000000;
    border: none;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    padding: 14px;
    border-radius: 20px;
    font-size: 16px;
    transition: all 0.2s ease;
}

.add-set:active:not(.disabled) {
    transform: scale(0.97);
}

.add-set.disabled {
    background: #f1f1f4;
    color: #9b9ba1;
}

.header {
    width: 90%;
    display: flex;
    align-items: center;
    gap: 12px;
}

.train-title {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: larger;
    font-weight: 700;
}

.train-title::placeholder {
    color: var(--placeholder-color);
}

.actions {
    flex-shrink: 0;
    display: flex;
    align-items: center;
}

.switch {
    display: flex;
    align-items: center;
    gap: 8px;
}

.switch input {
    display: none;
}

.slider {
    width: 42px;
    height: 24px;
    background: #ccc;
    border-radius: 12px;
    position: relative;
    transition: 0.2s;
}

.slider::after {
    content: '';
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 3px;
    left: 3px;
    transition: 0.2s;
}

.switch input:checked+.slider {
    background: #99BBFE;
}

.switch input:checked+.slider::after {
    transform: translateX(18px);
}

.table-head {
    width: 90%;
    display: grid;
    grid-template-columns: 14% 38% 38%;
    gap: 5%;
    margin-top: 12px;
    font-size: 13px;
    text-align: center;
}

.table-head.twoCols {
    grid-template-columns: 14% 76%;
}

.table-head span {
    display: flex;
    align-items: center;
    justify-content: center;
}

.table-head span:last-child:empty {
    display: none;
}

.rows {
    width: 90%;
    margin-top: 8px;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.rows span:last-child:empty {
    display: none;
}

.row {
    display: grid;
    grid-template-columns: 14% 38% 38%;
    gap: 5%;
    align-items: center;
}

.index {
    width: 40px;
    height: 40px;
    background: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 15px;
    color: #000;
}

.row input {
    height: 44px;
    background: #ffffff;
    border-radius: 22px;
    padding: 0 14px;
    font-size: 15px;
    text-align: center;
    color: #000;
    transition:
        box-shadow 0.2s ease,
        background-color 0.2s ease,
        transform 0.15s ease;
}

.row input:focus {
    background-color: #ffffff;
    box-shadow: 0 0 0 2px #99BBFE;
    transform: scale(1.02);
}

.row input:not(:placeholder-shown) {
    font-weight: 500;
}

.row input:only-of-type {
    grid-column: span 2;
}

input {
    border: none;
    outline: none;
    box-shadow: none;
    background: none;

    -webkit-appearance: none;
    -moz-appearance: textfield;
    appearance: none;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input::placeholder {
    color: #b0b0b5;
}
</style>