import axios from 'axios';

const BASE_URL = import.meta.env.VITE_FRIENDS_API_URL;

export async function getUsers(nickname, token) {
  const url = `${BASE_URL}/get-users?nickname=${encodeURIComponent(nickname)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token || ''}`
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // Сервер ответил с статусом ошибки
      throw new Error(`API error: ${error.response.status}`);
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      throw new Error('Network error: No response received');
    } else {
      // Что-то пошло не так при настройке запроса
      throw new Error(`Request error: ${error.message}`);
    }
  }
}

export async function sendFriendRequest(username, token) {
  const url = `${BASE_URL}/send-request-by-username/${encodeURIComponent(username)}`;

  const response = await axios.post(url, {}, {
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token || ''}`
    }
  });

  return response.data;
}

export async function getFriendRequests(token) {
  const url = `${BASE_URL}/pending`;

  const response = await axios.get(url, {
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token || ''}`
    }
  });

  return response.data;
}

export async function respondToFriendRequest(friendshipId, accept, token) {
  const url = `${BASE_URL}/respond/${encodeURIComponent(friendshipId)}?accept=${accept}`;

  const response = await axios.post(url,
    {},
    {
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token || ''}`
      },
    });

  return response.data;
}

export async function getFriendsList(token) {
  const url = `${BASE_URL}/list`;

  const response = await axios.get(url, {
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token || ''}`
    }
  });

  return response.data;
}