import { getEstructuras, Registrar, Actualizar } from './../services/EstructuraServices';
import { useGenericFetch } from './useGenericFetch';

const registrarEstructura = async (registrar) => {

    if (!registrar.id) {
        
        return await Registrar(registrar.descripcion, registrar.orden);
    } else {
        return await Actualizar(registrar.id, registrar.descripcion);
    }
};

export const useEstructuras = (initialParam = "", initialPage = 1) => {
    const generic =  useGenericFetch(getEstructuras, initialParam, initialPage);

    return {
        ...generic,
        registrarEstructura
    };

}
   
