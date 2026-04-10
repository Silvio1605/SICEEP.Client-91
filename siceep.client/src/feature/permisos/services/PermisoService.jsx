import api from "./../../../api/api";

export const getPermisos = async (idUsuario) => {
    return await api.get(`Permisos/Listar_ByUsuario?idUsuario=${idUsuario}`);
};

export const guardarPermisos = async (cambiosState) => {
    try {
        const res = await api.post(`Permisos/Asignar`, cambiosState);
        return res.data;
    } catch (error) {
        console.log("error: ", error.response.data);
    }
    
};
export const getEstructura = async (idUsuario) => {
    return await api.post(`Estructura/GetEstructura_byId?id=${idUsuario}`);
};
