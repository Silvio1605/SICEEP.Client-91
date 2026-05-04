import { updateRol } from './../services/usuarioService';

export const useRol = () => {
   
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

    return { actualizarRol };
};
