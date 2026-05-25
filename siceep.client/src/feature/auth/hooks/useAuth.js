import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login } from './../services/authService';

export const useAuth = () => {

    const [auth, setAuth] = useState({
        nombreUsuario: "",
        contraseña: "",
    });

    const navigate = useNavigate();

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

    const logout = () => {

        localStorage.removeItem("token");
        navigate("/");
    };

    return { auth, login, logout };
}
