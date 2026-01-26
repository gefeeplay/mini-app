import axios from 'axios';

const BASE_URL = import.meta.env.VITE_AVATARS_API_URL;

// Загрузка аватарки пользователя
export async function uploadAvatar(imageFile, token) {
    const url = `${BASE_URL}/avatar`;

    const formData = new FormData();
    formData.append('avatar', imageFile);

    const response = await axios.post(url, formData, {
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token || ''}`,
        }
    });

    return response;
}

// Получение аватарки пользователя
export async function getAvatar(token, username) {
    const url = `${BASE_URL}/avatar?username=${encodeURIComponent(username)}`;

    const response = await axios.get(url, {
        headers: {
            'accept': 'application/json',
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