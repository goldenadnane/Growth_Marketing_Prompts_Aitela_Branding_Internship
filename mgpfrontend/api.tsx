// api.js

import axios from 'axios';
const ApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
let jwtString = null;
if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    jwtString = token ? JSON.parse(token).token : null;
    console.log('machitoken', jwtString);
}

const api = axios.create({
    baseURL: `${ApiUrl}`,
    // Add your token to the headers by default
    headers: {
        Authorization: `Bearer ${jwtString}`,
    },
});

export default api;
