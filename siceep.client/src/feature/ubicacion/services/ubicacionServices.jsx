import api from "./../../../api/api";

export const registrarUbicacion = async (idEstructura, idUnidad) => {
    try {

        const response = await api.post('Ubicacion', null, {
            params: { idEstructura, idUnidad }

        });

        return {
            status: response.data.status,
            message: response.data.message || "Ubicacion registrada exitosamente"
        }; 

    } catch (error) {
        return {
            status: error.response?.data.status || error.status,
            message:
                error.response?.data?.message ||
                error.statusText
        };
    }
};

export const getUbicaciones = async (parametro, pagina) => {
    return api.get(`Ubicacion/Search`, {
        params: { parametro, page: pagina }
    });
};

export const actualizarEstado = async (id, estado) => {
    return api.put(`Ubicacion`, null, {
        params: { id, activo: estado }
    });
};
