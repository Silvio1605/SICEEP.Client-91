import axios from 'axios';
import { cerrarSesionPorTokenExpirado } from './../utils/sesion';

const esRutaAuth = (url) => /Auth\//.test(url || '');

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://localhost:8444/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor de respuesta (errores HTTP)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || error.response.data || 'Error inesperado';

            switch (status) {
                case 401:
                    console.warn('Error de validación:', message);
                    if (!esRutaAuth(error.config?.url)) {
                        cerrarSesionPorTokenExpirado('Tu sesión ha expirado. Ingresa nuevamente.');
                    }
                    break;
                case 400:
                    console.warn('Error de validación:', message);
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
            if (!esRutaAuth(error.config?.url)) {
                cerrarSesionPorTokenExpirado('No se pudo conectar con el servidor.');
            }
        }

        return Promise.reject(error);
    }
);

export default api;
