import { getUnidades } from './../services/ubicacionServices';
import { getUnidades, Registrar, Actualizar } from './../services/UnidadServices'
import { useGenericFetch } from './useGenericFetch';


const registrarUnidad = (id, descripcion) => {
    if (!descripcion) {
        return {
            status: 400,
            message: "El campo descripcion es obligatorio."
        };
    }

    if (!id) {
        return await Registrar(descripcion, orden);
    } else {
        return await Actualizar(id, descripcion);
    }
};

export const useUnidades = (initialParam = "", initialPage = 1) => {

    const generic = useGenericFetch(getUnidades, initialParam, initialPage);

    return {
        ...generic,
        registrarUnidad
    };
}
   