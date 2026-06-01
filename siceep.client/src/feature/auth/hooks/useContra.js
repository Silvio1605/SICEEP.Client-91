import { Reestablecer } from '../services/authService'; 

export const ContraUsuario = () => {

    const ReestablecerContraseña = async (usuario) => {

        if (usuario.nuevaContraseña !== usuario.contraseñaConfirmacion) {
            return {
                status: 400,
                message: "Las contraseñas no coinciden"
            };
        }

        const result = await Reestablecer(usuario);
        console.log(result);
        return result;
    };

    return { ReestablecerContraseña };
};