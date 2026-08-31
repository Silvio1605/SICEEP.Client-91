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

export const getExpedienteCompleto = (idEmpleado) => {
    return api.get(`Expediente/${idEmpleado}`);
}

export const actualizarExpediente = (idEmpleado, expediente) => {
    return api.put(`Expediente/${idEmpleado}`, expediente);
}

// tab infromacion laboral
export const searchPlaza = (ordinal, top) => {
    if (!ordinal || ordinal === '') {
        return Promise.reject(new Error('El ordinal es requerido'));
    }

    // Asegurar que top sea un número positivo
    const limit = Math.max(1, top || 10);

    return api.get(`Plaza/SearchByOrdinal`, {
        params: { ordinal, top: limit }
    });
};

export const getPlaza = (ordinal) => {
    return api.get(`Plaza/GetByOrdinal`, {
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

// ---------- Documentos (expediente digital) ----------

export const listarDocumentos = (idExpediente) => {
    return api.get(`Documento/${idExpediente}`);
};

export const subirDocumento = (idExpediente, datos, archivo) => {
    const form = new FormData();
    form.append('idTipoDocumento', datos.idTipoDocumento);
    if (datos.fechaDocumento) form.append('fechaDocumento', datos.fechaDocumento);
    form.append('archivo', archivo);

    // 'Content-Type: undefined' deja que el navegador ponga el boundary multipart
    return api.post(`Documento/${idExpediente}`, form, {
        headers: { 'Content-Type': undefined }
    });
};

export const descargarDocumento = (idDocumento) => {
    return api.get(`Documento/${idDocumento}/descargar`, {
        responseType: 'blob',
        headers: { 'Content-Type': 'application/json' }
    });
};

export const eliminarDocumento = (idDocumento) => {
    return api.delete(`Documento/${idDocumento}`);
};
