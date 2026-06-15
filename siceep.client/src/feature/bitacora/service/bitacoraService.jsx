import api from "./../../../api/api";

export const getBitacora = async (filtros) => {
    try {
        const response = await api.post('Bitacora/Listar', filtros);
        return response;
    } catch (error) {
        console.error("Error al obtener: ", error);
        throw error;
    }
};

export const getAcciones = async () => {
    try {
        return await api.get('LookUp/Select_Acciones');

    } catch (error) {
        console.error("Error al obtener acciones: ", error);
    }
};