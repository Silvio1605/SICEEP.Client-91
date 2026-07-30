import api from "../../../api/api";

export const getExpedientes = async (filtro) => {
    return await api.post(`Empleado/Search`, filtro);
}

export const selectEstado = async () => {
    return await api.get(`LookUp/Select_Empelado`);
}

