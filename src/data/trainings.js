import { reactive, ref } from "vue";

export function createTrainings(userStore){
return ref([
    reactive({
        tr_id: 1,
        username: userStore.username,
        tr_name: 'Пиво с утреца',
        tr_sets: 5,
        tr_count: 1,
        tr_value: 1,
        tr_measure: 'л'
    }),
    reactive({
        tr_id: 2,
        username: ref('User2'),
        tr_name: 'Пиво с утреца',
        tr_sets: 5,
        tr_count: 2,
        tr_value: 1,
        tr_measure: 'л'
    }),
    reactive({
        tr_id: 3,
        username: ref('User3'),
        tr_name: 'Пиво с утреца',
        tr_sets: 5,
        tr_count: 3,
        tr_value: 1,
        tr_measure: 'л'
    }),
    reactive({
        tr_id: 4,
        username: userStore.username,
        tr_name: 'Пиво с утреца',
        tr_sets: 5,
        tr_count: 4,
        tr_value: 1,
        tr_measure: 'л'
    }),
    reactive({
        tr_id: 5,
        username: userStore.username,
        tr_name: 'Пиво с утреца',
        tr_sets: 5,
        tr_count: 6,
        tr_value: 1,
        tr_measure: 'л'
    }),
    reactive({
        tr_id: 6,
        username: userStore.username,
        tr_name: 'Пиво с утреца',
        tr_sets: 5,
        tr_count: 6,
        tr_value: 1,
        tr_measure: 'л'
    }),
    reactive({
        tr_id: 7,
        username: userStore.username,
        tr_name: 'Пиво с утреца',
        tr_sets: 5,
        tr_count: 7,
        tr_value: 1,
        tr_measure: 'л'
    })
]);
}