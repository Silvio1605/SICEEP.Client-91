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

// Registra una acción en la bitácora. Es voluntaria (fire-and-forget):
// un fallo al auditar nunca debe romper el guardado principal.
export const registrarBitacora = async (idAccion, descripcion) => {
    try {
        await api.post('Bitacora/Registrar', {
            idAccion,
            descripcion
        });
    } catch (error) {
        console.warn("No se pudo registrar la acción en la bitácora:", error);
    }
};