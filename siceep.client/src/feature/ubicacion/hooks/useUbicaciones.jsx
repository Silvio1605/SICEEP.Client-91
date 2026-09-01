import { getUbicaciones, registrarUbicacion, actualizarEstado } from './../services/ubicacionServices';
import { useGenericFetch } from './useGenericFetch';

const registrar = async (idEstructura, idUnidad) => {

    if (!idEstructura || !idUnidad) {
        return {
            status: 400,
            message: "Debe seleccionar la estructura y la unidad para poder registrar la ubicación."
        };
    }
    var result = await registrarUbicacion(idEstructura, idUnidad);

    return result;
};

const actualizar = async (idUbicacion, estado) => {

    var result = await actualizarEstado(idUbicacion, estado);
    return result;
};

export const useUbicaciones = (initialParam = "", initialPage = 1) => {
    const generic = useGenericFetch(getUbicaciones, initialParam, initialPage);

    return {
        ...generic,
        registrar,
        actualizar
    };
};
