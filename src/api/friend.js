import axios from 'axios';

export async function getUsers(nickname, token) {
  const url = `https://gainly.site/auth/api/friends/get-users?nickname=${encodeURIComponent(nickname)}`;

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