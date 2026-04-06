import api from "./../api/api";

export const getUsuarios = async (filtros) => {
    return await api.post(`Usuario/Busqueda`, filtros);
};

export const getEstructura = async (idUsuario) => {
    return await api.post(`Estructura/GetEstructura_byId?id=${idUsuario}`);
};
