import api from "./../api/api";

export const getUsuarios = async (filtros) => {
    return await api.post(`Usuario/Busqueda`, filtros);
};

