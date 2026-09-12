import api from "./../../../api/api";

export const getFuerzaLaboral = () => api.get("Reporte/FuerzaLaboral");

export const getAltasBajas = (mes, anio) =>
    api.get("Reporte/AltasBajas", { params: { mes, anio } });

export const getConstanciaBaja = (idEmpleado) =>
    api.get(`Reporte/ConstanciaBaja/${idEmpleado}`);