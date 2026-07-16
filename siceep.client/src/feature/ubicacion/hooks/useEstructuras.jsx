import { getEstructuras, Registrar, Actualizar } from './../services/EstructuraServices';
import { useGenericFetch } from './useGenericFetch';

const registrarEstructura = async (id, descripcion, orden) => {

    if (!descripcion) {
        return {
            status: 400,
            message: "El campo descripcion es obligatorio."
        };
    }

    if (!id) {
        if (!orden) {
            return {
                status: 400,
                message: "El orden es obligatorio."
            };
        }

        return await Registrar(descripcion, orden);
    } else {
        return await Actualizar(id, descripcion);
    }
    
};

export const useEstructuras = (initialParam = "", initialPage = 1) => {
    const generic =  useGenericFetch(getEstructuras, initialParam, initialPage);

    return {
        ...generic,
        registrarEstructura
    };

}
   
