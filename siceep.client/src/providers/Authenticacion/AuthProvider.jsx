import { useState, useMemo, useCallback, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { Login, Logout, Me } from "./../../feature/auth/services/authService";
import { cerrarSesionPorTokenExpirado } from "./../../utils/sesion";

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
        queueMicrotask(() => verificarSesion());
    }, []);

    // Heartbeat: cada 5 minutos verifica que la sesión siga válida,
    // detectando expiración del token o pérdida de conexión estando inactivo.
    useEffect(() => {
        if (!autenticado) return;

        const intervalo = setInterval(async () => {
            try {
                await Me();
            } catch {
                setAutenticado(false);
                setUsuario(null);
                clearInterval(intervalo);
                cerrarSesionPorTokenExpirado('Tu sesión ha expirado. Ingresa nuevamente.');
            }
        }, 5 * 60 * 1000);

        return () => clearInterval(intervalo);
    }, [autenticado]);

    const login = useCallback(async (nombreUsuario, contraseña) => {

        try {
            const response = await Login({ nombreUsuario, contraseña });

            if (response.status === 200) {

                await verificarSesion();

                return {
                    valid: true,
                    mensaje: response.data?.mensaje
                };
            }

            return {
                valid: false,
                mensaje: response.data?.mensaje || "Credenciales inválidas"
            };
        } catch (error) {
            // Sin respuesta = sin conexión o timeout del servidor
            if (!error.response) {
                return {
                    valid: false,
                    mensaje: "No se pudo conectar con el servidor. Verifica tu conexión e intente de nuevo."
                };
            }

            return {
                valid: false,
                mensaje: error.response.data?.mensaje || "Credenciales inválidas"
            };
        }
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