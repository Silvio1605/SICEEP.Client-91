import { useState, useMemo, useCallback, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { Login, Logout, Me } from "./../../feature/auth/services/authService";
import { cerrarSesionPorTokenExpirado } from "./../../utils/sesion";

export const AuthProvider = ({ children }) => {

    const [autenticado, setAutenticado] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

  
    const verificarSesion = async () => {
        // Si la sesión fue marcada como cerrada (logout/expiración forzada),
        // no reutilizar una cookie aún vigente: se exige volver a iniciar sesión.
        let sesionCerrada = false;
        try {
            sesionCerrada = sessionStorage.getItem('siceep_sesion_cerrada') === '1';
        } catch {
            sesionCerrada = false;
        }
        if (sesionCerrada) {
            setAutenticado(false);
            setUsuario(null);
            setLoading(false);
            return;
        }

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

    // Bloqueo por inactividad: si el usuario no interactúa en 10 minutos,
    // la sesión se cierra. El timer se resetea con cualquier interacción
    // y al volver a la pestaña se comprueba cuánto tiempo pasó de verdad
    // (los timers se throttlean en segundo plano, así que se mide con Date.now()).
    useEffect(() => {
        if (!autenticado) return;

        const LIMITE_INACTIVIDAD = 5 * 60 * 1000;
        let ultimaActividad = Date.now();
        let temporizador = null;

        const expulsar = () => {
            setAutenticado(false);
            setUsuario(null);
            cerrarSesionPorTokenExpirado('Sesión inactiva. Ingresa nuevamente.');
        };

        const reiniciar = () => {
            ultimaActividad = Date.now();
            clearTimeout(temporizador);
            temporizador = setTimeout(expulsar, LIMITE_INACTIVIDAD);
        };

        const alVolver = () => {
            if (document.visibilityState !== 'visible') return;
            if (Date.now() - ultimaActividad >= LIMITE_INACTIVIDAD) expulsar();
            else reiniciar();
        };

        const eventos = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'click', 'scroll'];
        eventos.forEach((ev) => window.addEventListener(ev, reiniciar, { passive: true }));
        document.addEventListener('visibilitychange', alVolver);

        reiniciar();

        return () => {
            clearTimeout(temporizador);
            eventos.forEach((ev) => window.removeEventListener(ev, reiniciar));
            document.removeEventListener('visibilitychange', alVolver);
        };
    }, [autenticado]);

    const login = useCallback(async (nombreUsuario, contraseña) => {

        try {
            const response = await Login({ nombreUsuario, contraseña });

            if (response.status === 200) {

                // Sesión nueva: quitar el marcador de "sesión cerrada"
                // (si quedó de un logout/expiración anterior en esta pestaña).
                try {
                    sessionStorage.removeItem('siceep_sesion_cerrada');
                } catch {
                    // sin almacenamiento disponible
                }

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

    // Acepta un id de recurso o una lista de ellos: basta con tener alguno.
    // Los permisos llegan como Id_Recurso en texto dentro del claim "Permisos".
    const tienePermiso = useCallback((permiso) => {
        if (!usuario?.permisos)
            return false;

        if (Array.isArray(permiso))
            return permiso.some(p => usuario.permisos.includes(p.toString()));

        if (permiso === undefined || permiso === null)
            return true;

        return usuario.permisos.includes(permiso.toString());
    }, [usuario]);

    const logout = useCallback(async () => {
        // try/finally: aunque el servidor no responda, la sesión local se cierra
        // y se marca para no reutilizar una cookie aún vigente.
        try {
            await Logout();
        } finally {
            try {
                sessionStorage.setItem('siceep_sesion_cerrada', '1');
            } catch {
                // sin almacenamiento disponible
            }
            setAutenticado(false);
            setUsuario(null);
        }
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