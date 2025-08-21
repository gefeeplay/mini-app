import { defineStore } from 'pinia'
import { ref, computed, unref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const username = ref('')

    /*
    const userStore = useUserStore()
    const trainings = createTrainings(userStore)
    */

    const trainings = ref([
        {
            tr_id: 1,
            /*username,*/
            tr_name: 'Пиво с утреца',
            tr_sets: 5,
            tr_count: 1,
            tr_value: 1,
            tr_measure: 'л'
        },
        {
            tr_id: 2,
            username: ref('User2'),
            tr_name: 'Пиво с утреца',
            tr_sets: 5,
            tr_count: 2,
            tr_value: 1,
            tr_measure: 'л'
        },
        {
            tr_id: 3,
            username: ref('User3'),
            tr_name: 'Пиво с утреца',
            tr_sets: 5,
            tr_count: 3,
            tr_value: 1,
            tr_measure: 'л'
        },
        {
            tr_id: 4,
            /*username,*/
            tr_name: 'Пиво с утреца',
            tr_sets: 5,
            tr_count: 4,
            tr_value: 1,
            tr_measure: 'л'
        },
        {
            tr_id: 5,
            /*username,*/
            tr_name: 'Пиво с утреца',
            tr_sets: 5,
            tr_count: 6,
            tr_value: 1,
            tr_measure: 'л'
        },
        {
            tr_id: 6,
            /*username,*/
            tr_name: 'Пиво с утреца',
            tr_sets: 5,
            tr_count: 6,
            tr_value: 1,
            tr_measure: 'л'
        },
        {
            tr_id: 7,
            /*username,*/
            tr_name: 'Пиво с утреца',
            tr_sets: 5,
            tr_count: 7,
            tr_value: 1,
            tr_measure: 'л'
        }
    ])

    const trainingsWithUsername = computed(() =>
        trainings.value.map(t => {
            const raw = t.username ?? username      // либо свой username, либо общий из стора
            return { ...t, usernameStr: unref(raw) } // unref даёт строку
        })
    )

    function setUsername(newName) {
        username.value = newName
        localStorage.setItem('username', newName)
    }

    function loadUsername() {
        const saved = localStorage.getItem('username')
        if (saved) username.value = saved
    }
    return { username, trainings, setUsername, loadUsername, trainingsWithUsername }
})