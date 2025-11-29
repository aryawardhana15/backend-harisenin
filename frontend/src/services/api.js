import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authAPI = {
    register: (data) => api.post('/register', data),
    login: (data) => api.post('/login', data),
};

export const movieAPI = {
    getAll: (params) => api.get('/movie', { params }),
    getById: (id) => api.get(`/movie/${id}`),
    create: (data) => api.post('/movie', data),
    update: (id, data) => api.patch(`/movie/${id}`, data),
    delete: (id) => api.delete(`/movie/${id}`),
};

export default api;
