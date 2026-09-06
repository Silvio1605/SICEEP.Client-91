import api from "./../../../api/api";

export const getPlazas = (params) => api.get("Plaza/Listar", { params });

export const getCargos = () => api.get("Plaza/Cargos");

export const registrarPlaza = (data) => api.post("Plaza", data);

export const getUbicacionesFiltro = (idEstructura, idUnidad) =>
    api.get("Ubicacion/ByEstructuraYUnidad", { params: { idEstructura, idUnidad } });

export const getSituacion = (idEmpleado) =>
    api.get("Recorrido/Situacion", { params: { idEmpleado } });

export const getHistorial = (idEmpleado) =>
    api.get("Recorrido/Historial", { params: { idEmpleado } });

export const registrarMovimiento = (data) =>
    api.post("Recorrido/Movimiento", data);