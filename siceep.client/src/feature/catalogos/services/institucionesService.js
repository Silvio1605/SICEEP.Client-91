import api from "../../../api/api";

export const listarInstituciones = async () => {
    const response = await api.get(`Estudios/Instituciones`);
    return response.data;
};

export const listarTiposInstitucion = async () => {
    const response = await api.get(`Estudios/TiposInstitucion`);
    return response.data;
};

export const listarPaises = async () => {
    const response = await api.get(`Estudios/Paises`);
    return response.data;
};

export const agregarInstitucion = async (institucion) => {
    try {
        const response = await api.post(`Estudios/Instituciones`, institucion);
        return response.data;
    } catch (error) {
        throw error.response?.data ?? "Error al agregar la institución";
    }
};

export const actualizarInstitucion = async (id, institucion) => {
    try {
        const response = await api.put(`Estudios/Instituciones/${id}`, institucion);
        return response.data;
    } catch (error) {
        throw error.response?.data ?? "Error al actualizar la institución";
    }
};

export const eliminarInstitucion = async (id) => {
    try {
        const response = await api.delete(`Estudios/Instituciones/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data ?? "Error al eliminar la institución";
    }
};