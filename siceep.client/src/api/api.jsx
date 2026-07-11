import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7109/api',
    withCredentials: true,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Agregar el token dinámicamente antes de cada solicitud
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuesta (atrapa TODOS los errores HTTP)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || error.response.data || 'Error inesperado';

            switch (status) {
                case 401:
                    window.location.href = '/login';
                    break;
                case 400:
                    console.warn('Error de validación:', message);
                    // Podrías mostrar un toast si quieres, o dejarlo para que el componente lo maneje
                    break;
                case 404:
                    console.warn('Recurso no encontrado:', error.config.url);
                    break;
                case 500:
                    console.error('Error del servidor:', message);
                    break;
                default:
                    console.error(`Error ${status}:`, message);
            }
        } else {
            console.error('Error de red o sin respuesta:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;