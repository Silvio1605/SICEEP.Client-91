import api from "../../../api/api";

export const getExpedientes = async (filtro) => {
    return await api.post(`Empleado/Search`, filtro);
}

export const selectEstado = async () => {
    return await api.get(`LookUp/Select_Empelado`);
}

export const crearExpediente = (expediente) => {
    return api.post(`Expediente`, expediente);
}


export const buscarPlaza = (ordinal, top) => {
    return api.get(`SearchByOrdinal`, null, {
        params: { ordinal, top }
    });
};

export const obtenerPlaza = (ordinal) => {
    return api.get(`GetByOrdinal`, null, {
        params: { ordinal }
    });
};

export const getSelectSexo = async () => {
    return await api.get(`LookUp/Select_Sexo`);
};

export const getSelectSexo = async () => {
    return await api.get(`LookUp/Select_Civil`);
};

export const getSelectCaracteristicas = async () => {
    return await api.get(`LookUp/Select_Caracteristicas`);
};

export const getSelectCaracteristicas = async () => {
    return await api.get(`LookUp/Select_Caracteristicas`);
};