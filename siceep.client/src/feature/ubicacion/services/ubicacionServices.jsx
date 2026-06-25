import api from "./../../../api/api";

export const getEstructuras = async (parametro, pagina) => {
    try {
        return await api.get(`Ubicacion/ListarEstructuras?parametro=${parametro}&page=${pagina}`);
    } catch (error) {
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
