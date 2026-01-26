import axios from 'axios'

const BASE_URL = import.meta.env.VITE_USER_API_URL

export async function changeUsername(token, newUsername) {
    const url = `${BASE_URL}/change-username`;
    console.log("New username:", newUsername); // New username: undefined
    try {
        const response = await axios.patch(url,
            { newUsername: newUsername },
            {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token || ''}`,
                }

            }
        );

        return response.data;
    } catch (error) { throw error; }

}