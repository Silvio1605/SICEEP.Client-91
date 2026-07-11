import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { Login, Logout, Me } from "./../../feature/auth/services/authService";

export const AuthProvider = ({ children }) => {

    const [autenticado, setAutenticado] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        verificarSesion();
    }, []);

    const verificarSesion = async () => {
        try {

            const response = await Me();

            setAutenticado(true);
            setUsuario(response.data);

        } catch {

            setAutenticado(false);
            setUsuario(null);

        } finally {

            setLoading(false);

        }
    };

    const login = async (nombreUsuario, contraseña) => {

        const response = await Login({
            nombreUsuario,
            contraseña
        });

        if (response.status === 200) {

            await verificarSesion();

            return {
                valid: true,
                mensaje: response.data.mensaje
            };
        }

        return {
            valid: false,
            mensaje: "Credenciales inválidas"
        };
    };

    const logout = async () => {

        await Logout();

        setAutenticado(false);
        setUsuario(null);
    };

    return (
        <AuthContext.Provider
            value={{
                autenticado,
                usuario,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};