import { getUnidades, registrar, actualizar } from './../services/UnidadServices'
import { useGenericFetch } from './useGenericFetch';

const registrarUnidad = async (datos) => {

    if (!datos.id) {
        return await registrar(datos.descripcion);
    } else {
        return await actualizar(datos.id, datos.descripcion);
    }
};

export const useUnidades = (initialParam = "", initialPage = 1) => {

    const generic = useGenericFetch(getUnidades, initialParam, initialPage);

    return {
        ...generic,
        registrarUnidad
    };
}
   