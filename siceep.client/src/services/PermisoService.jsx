import api from "./../api/api";

export const getPermisos = async (idUsuario) => {
    return await api.get(`Permisos/ListarGeneral_ByUsuario?idUsuario=${idUsuario}`);
};

