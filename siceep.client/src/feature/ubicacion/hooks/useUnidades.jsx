import { getUnidades, registrar, actualizar } from './../services/UnidadServices'
import { useGenericFetch } from './useGenericFetch';

const registrarUnidad = async (id, descripcion, orden) => {
    
    if (!id) {
        return await registrar(descripcion, orden);
    } else {
        return await actualizar(id, descripcion);
    }
};

export const useUnidades = (initialParam = "", initialPage = 1) => {

    const generic = useGenericFetch(getUnidades, initialParam, initialPage);

    return {
        ...generic,
        registrarUnidad
    };
}
   