import api from "./../../../api/api";

export const getUsuarios = async (filtros) => {
    try {
        return await api.post(`Usuario/Busqueda`, filtros);
    } catch (error) {
        console.log(error);
    }
};

