let redirigiendo = false;

const baseUrl = import.meta.env.VITE_API_URL || 'https://localhost:8444/api';

export const cerrarSesionPorTokenExpirado = (motivo = 'Sesión expirada') => {
    if (redirigiendo) return;
    redirigiendo = true;
    try {
        sessionStorage.setItem('siceep_motivo_logout', motivo);
        // Marca la sesión como cerrada: aunque la cookie HttpOnly permanezca
        // (p. ej. si el servidor estaba caído), el token no se reutilizará.
        sessionStorage.setItem('siceep_sesion_cerrada', '1');
    } catch {
        // sin almacenamiento disponible
    }
    // Intento best-effort de invalidar la cookie en el servidor.
    // No bloquea el redirect; si falla (servidor caído o token expirado) no importa.
    try {
        fetch(`${baseUrl.replace(/\/$/, '')}/Auth/Logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch {
        // servidor inalcanzable
    }
    window.location.replace('/');
};