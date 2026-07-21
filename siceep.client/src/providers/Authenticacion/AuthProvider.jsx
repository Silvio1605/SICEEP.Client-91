import { useState, useMemo, useCallback, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { Login, Logout, Me } from "./../../feature/auth/services/authService";

export const AuthProvider = ({ children }) => {

    const [autenticado, setAutenticado] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

  
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

    useEffect(() => {
        verificarSesion();
    }, []);

    const login = useCallback(async (nombreUsuario, contraseña) => {

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
    }, []);

    const tienePermiso = useCallback((permiso) => {

        if (!usuario?.permisos)
            return false;

        return usuario.permisos.includes(permiso.toString());
    }, [usuario]);

    const logout = useCallback(async () => {

        await Logout();

        setAutenticado(false);
        setUsuario(null);
    }, []);

    const contextValue = useMemo(() => ({
        autenticado,
        usuario,
        loading,
        login,
        tienePermiso,
        logout
    }), [autenticado, usuario,
        loading,login,
        tienePermiso, logout]);

    return (
        <AuthContext.Provider
            value={contextValue}
        >
            {children}
        </AuthContext.Provider>
    );
};