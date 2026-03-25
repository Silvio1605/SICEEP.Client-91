import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7109/api',
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Agregar el token dinámicamente antes de cada solicitud
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt-token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;