/* eslint-disable react-refresh/only-export-components */
import api from "./../../../api/api";

export const registrarUsuario = async (usuario) => {
    try {
        const response = await api.post(
            "Usuario/Registrar",
            usuario
        );

        return {
            status: response.data.status,
            message: response.data.message || "Usuario registrado exitosamente"
        };

    } catch (error) {
        return {
            status: error.response?.status || error.status,
            message:
                error.response?.data?.message ||
                error.message
        };
    }
};

export const deshabilitarUsuario = async (usuario) => {
    try {
        return await api.put(`Usuario/Actualizar_Estado`, usuario);
    } catch (error) {
        console.log(error.response.data);
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

export const BuscarUsuario = async (busqueda) => {
    try {
        return await api.get(`Usuario/GetUsuario_byUsername?nombreUsuario=${busqueda}`);
    } catch (error) {
        console.log(error);
    }
};