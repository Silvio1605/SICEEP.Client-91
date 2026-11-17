import { updateRol } from './../services/usuarioService';


const actualizarRol = async (id, cambioRol) => {

    const rolActualizado = {
        idUsuario: id,
        idRol: cambioRol,
    };

    try {
        return await updateRol(rolActualizado);
    } catch (error) {
        console.log(error);
        // Se relanza para que la pantalla pueda avisar que el cambio falló;
        // antes se tragaba el error y siempre decía "actualizado".
        throw error;
    }
};

export const useRol = () => {
   
    return { actualizarRol };
};
