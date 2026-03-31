import api from "./../api/api";

export const getSelectUsuario = async () => {
    return await api.get(`LookUp/Select_Usuario`);
};

