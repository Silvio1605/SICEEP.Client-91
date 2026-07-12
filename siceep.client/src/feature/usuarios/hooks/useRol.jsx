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
    }
};

export const useRol = () => {
   
    return { actualizarRol };
};
