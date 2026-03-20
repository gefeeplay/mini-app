import axios from 'axios'
import { API_CONFIG } from '../config/api.config.js'

const BASE_URL = API_CONFIG.WORKOUT_API_URL

export async function createTraining(token, training) {
    const url = `${BASE_URL}/create`;

    try {
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

    try {
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

export async function deleteTraining(token, trainingId) {
    const url = `${BASE_URL}/${trainingId}`;

    try{
        const response = await axios.delete(
            url,
            {
                headers: {
                    Accept: '*/*',
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (error) { throw error }
}

export async function getUserProfile(token, username) {
    const url = `${BASE_URL}/profile/${username}`

    try {
        const response = await axios.get(
            url,
            {
                headers: {
                    Accept: 'text/plain',
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return response.data

    } catch (error) { throw error }
}

export async function getFriendTrainings(token, username, options = {}) {
    let query = ''

    if (options.last) {
        query = `?Last=${options.last}`
    } else if (options.from && options.to) {
        query = `?From=${options.from}&To=${options.to}`
    }

    const url = `${BASE_URL}/workouList/${username}${query}`

    try {
        const response = await axios.get(url, {
            headers: {
                Accept: 'text/plain',
                Authorization: `Bearer ${token}`
            }
        })

        return response.data

    } catch (error) {
        throw error
    }
}