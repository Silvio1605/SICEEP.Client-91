import api from "./../api/api";

export const getPermisos = async () => {
    return await api.get("Permisos/ListarGeneral_ByUsuario?idUsuario=5");
};

