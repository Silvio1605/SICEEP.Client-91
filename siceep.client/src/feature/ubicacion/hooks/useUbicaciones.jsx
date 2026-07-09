import { getUbicaciones, registrarUbicacion } from './../services/ubicacionServices';
import { useGenericFetch } from './useGenericFetch';

export const useUbicaciones = (initialParam = "", initialPage = 1) => {
    const generic = useGenericFetch(getUbicaciones, initialParam, initialPage);

    const registrar = async (idEstructura, idUnidad) => {

        // Validación
        if (!idEstructura || !idUnidad) {
            return {
                status: 400,
                message: "Debe seleccionar la estructura y la unidad para poder registrar la ubicación."
            };
        }

        const response = await registrarUbicacion(idEstructura, idUnidad);
        return response;
    };

    return {
        ...generic,
        registrar,
    };
};
