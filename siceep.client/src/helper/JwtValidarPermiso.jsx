import { obtenerPermisos } from './JwtObtenerPermisos';

export const tienePermiso = (permiso) => {

    const permisos = obtenerPermisos();

    return permisos.includes(permiso.toString());
};
