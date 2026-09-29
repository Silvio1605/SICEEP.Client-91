import api from "./../../../api/api";

/**
 * Cambio de contraseña del usuario autenticado.
 * El backend toma el usuario del token, por lo que no se envía ningún id.
 */
export const CambiarMiContrasena = async (datos) => {
    try {
        const response = await api.post("Auth/CambiarMiContraseña", datos);
        return {
            status: response.data.status,
            message: response.data.message
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            message: error.response?.data?.message || error.message
        };
    }
};
