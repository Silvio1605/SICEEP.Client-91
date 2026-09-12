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

export const getDeducciones = (idEmpleado) =>
    api.get("Deduccion/Listar", { params: { idEmpleado } });

export const getTiposDeduccion = () => api.get("Deduccion/Tipos");

export const getInstitucionesDeduccion = () => api.get("Deduccion/Instituciones");

export const registrarDeduccion = (data) => api.post("Deduccion", data);

export const actualizarDeduccion = (data) => api.put(`Deduccion/${data.idDeduccion}`, data);

export const eliminarDeduccion = (idDeduccion) => api.delete(`Deduccion/${idDeduccion}`);

export const registrarInstitucionDeduccion = (data) => api.post("Deduccion/Instituciones", data);

export const actualizarInstitucionDeduccion = (data) =>
    api.put(`Deduccion/Instituciones/${data.idInstitucionExterna}`, data);

export const eliminarInstitucionDeduccion = (idInstitucionExterna) =>
    api.delete(`Deduccion/Instituciones/${idInstitucionExterna}`);