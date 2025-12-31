import axios from 'axios'

const BASE_URL = 'https://fitness-app-workout-api.fly.dev/api/Workout'

export async function createTraining(token, training) {
    const url = `${BASE_URL}/create`;

    try{
        const response = await axios.post(
            url,
            training,
            {
            headers: {
                Accept: 'text/plain',
                Authorization: `Bearer ${token}`
            }
            }
        );

        return response.data
    } catch (error) { throw error; }
}


export async function getWorkoutList(token) {
    const url = `${BASE_URL}/workouList`;

    try{
        const response = await axios.get(
            url,
            {
                headers: {
                    'accept': 'text/plain',
                    'Authorization': `Bearer ${token || ''}`
                }
            }
        );

        return response.data

    } catch (error) { throw error; }
}