import axios from 'axios';

const BASE_URL = 'https://gainly-avatars.fly.dev/api';

// Загрузка аватарки пользователя
export async function uploadAvatar(imageFile, token) {
    const url = `${BASE_URL}/avatar`;

    const response = await axios.post(url, imageFile, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token || ''}`
        }
    });

    return response.data;
}

// Получение аватарки пользователя
export async function getAvatar(token, username) {
    const url = `${BASE_URL}/avatar?username=${encodeURIComponent(username)}`;

    const response = await axios.get(url, {
        headers: {
            'accept':'application/json',
            'Authorization': `Bearer ${token || ''}`
        },

    });

    return response.data;

}

// Получение аватарки текущего пользователя
export async function getMyAvatar(token) {
    const url = `${BASE_URL}/avatar/me`;

    const response = await axios.get(url, {
        headers: {
            'Accept': 'image/*',
            'Authorization': `Bearer ${token || ''}`
        },
    });

    return response.data;

}