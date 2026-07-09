import api from "./../../../api/api";

export const registrarUbicacion = async (idEstructura, idUnidad) => {
    try {
        const response = await api.post(`Ubicacion/Registrar?idEstructura=${idEstructura}&idUnidad=${idUnidad}`);

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

export const getEstructuras = async (parametro, pagina) => {
    try {
        return await api.get(`Ubicacion/ListarEstructuras?parametro=${parametro}&page=${pagina}`);
    } catch (error)
    {
        console.log(error);
    }
};

export const getUnidades = async (parametro, pagina) => {
    try {
        return await api.get(`Ubicacion/ListarUnidad?parametro=${parametro}&page=${pagina}`);
    } catch (error) {
        console.log(error);
    }
};

export const getUbicaciones = async (parametro, pagina) => {
    try {
        return await api.get(`Ubicacion/ListarUbicaciones?parametro=${parametro}&page=${pagina}`);
    } catch (error) {
        console.log(error);
    }
};
