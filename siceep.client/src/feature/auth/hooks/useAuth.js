import { useState } from 'react';
import { Login } from './../services/authService';

export const useAuth = () => {
    const [auth, setAuth] = useState({
        nombreUsuario: "",
        contraseña: "",
    });

    const login = async (nombreUsuario, contraseña) => {

        setAuth({ nombreUsuario, contraseña });

        const isValid = auth.nombreUsuario.trim() !== "" && auth.contraseña.trim() !== "";

        if (isValid) {
            const response = await Login(auth);
            if (response && response.data) {
                const { token, mensaje } = response.data;
                localStorage.setItem("token", token);
                return { mensaje };
            }
        }
    };

    return { auth, login };
}
