import api from "../../../api/api";

export const getExpedientes = async (filtro) => {
    return await api.post(`Empleado/Search`, filtro);
}

