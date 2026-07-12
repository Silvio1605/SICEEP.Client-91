import { getUbicaciones, registrarUbicacion } from './../services/ubicacionServices';
import { useGenericFetch } from './useGenericFetch';

const registrar = async (idEstructura, idUnidad) => {

    if (!idEstructura || !idUnidad) {
        return {
            status: 400,
            message: "Debe seleccionar la estructura y la unidad para poder registrar la ubicación."
        };
    }

    return await registrarUbicacion(idEstructura, idUnidad);
};

export const useUbicaciones = (initialParam = "", initialPage = 1) => {
    const generic = useGenericFetch(getUbicaciones, initialParam, initialPage);

    return {
        ...generic,
        registrar,
    };
};
