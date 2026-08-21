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

// tab infromacion laboral
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

//tab informacion general (persona)
export const getSelectSexo = async () => {
    return await api.get(`LookUp/Select_Sexo`);
};

export const getSelectEstCivil = async () => {
    return await api.get(`LookUp/Select_Civil`);
};

// tab caracteristicas fisicas
export const getSelectCaracteristicas = async () => {
    return await api.get(`LookUp/Select_Caracteristicas`);
};
