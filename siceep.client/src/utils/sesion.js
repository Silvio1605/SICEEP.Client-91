let redirigiendo = false;

export const cerrarSesionPorTokenExpirado = (motivo = 'Sesión expirada') => {
    if (redirigiendo) return;
    redirigiendo = true;
    try {
        localStorage.removeItem('token');
    } catch {
        // sin almacenamiento disponible
    }
    try {
        sessionStorage.setItem('siceep_motivo_logout', motivo);
    } catch {
        // sin almacenamiento disponible
    }
    window.location.replace('/');
};