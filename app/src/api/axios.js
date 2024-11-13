import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.0.138:8000', // Replace with your backend URL if needed
});

export default api;
