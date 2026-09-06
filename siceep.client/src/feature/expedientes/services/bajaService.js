import api from "../../../api/api";

export const getTiposBaja = async () => {
    return await api.get(`Baja/Tipos`);
}

export const aplicarBaja = (datos) => {
    return api.post(`Baja/Aplicar`, datos);
}

export const reactivarEmpleado = (datos) => {
    return api.post(`Baja/Reactivar`, datos);
}