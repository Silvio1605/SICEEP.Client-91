/* eslint-disable react-refresh/only-export-components */
import api from "./../../../api/api";

export const registrarUsuario = async (registro) => {
    try {
        const { nombrePropietario: _, ...data } = registro;
        return await api.post(`Usuario/Registrar`, data);
    } catch (error) {
        console.log(error);
    }
};

export const getUsuarios = async (filtros) => {
    try {
        return await api.post(`Usuario/Busqueda`, filtros);
    } catch (error) {
        console.log(error);
    }
};

export const getEstructura = async (idUsuario) => {
    return await api.post(`Estructura/GetEstructura_byId?id=${idUsuario}`);
};

export const getUsuariosById = async (id) => {
    try {
        return await api.get(`Usuario/GetUsuario_byId?id=${id}`);
    } catch (error) {
        console.log(error);
    }
};

export const updateExpiracion = async (cambioExpiracion) => {
    try {
        return await api.put(`Usuario/Actualizar_Expiracion`, cambioExpiracion);
    } catch (error) {
        console.log(error);
    }
};

export const updateRol = async (cambioRol) => {
    try {
        return await api.post(`Rol/Actualizar`, cambioRol);
    } catch (error) {
        console.log(error);
    }
};

export const BuscarPropietario = async (busqueda) => {
    try {
        return await api.get(`Empleado/EmpleadoByNombre?busqueda=${busqueda}`);
    } catch (error) {
        console.log(error);
    }
};

