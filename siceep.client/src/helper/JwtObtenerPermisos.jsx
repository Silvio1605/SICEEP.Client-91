import { jwtDecode } from "jwt-decode";

export const obtenerPermisos = () => {

    const token = localStorage.getItem("token");
    if (!token) return [];

    const decoded = jwtDecode(token);
    return decoded.Permisos || [];
};

