import api from "./../../../api/api";

export const getUnidades = (parametro, pagina) => {
    return api.get(`Unidad/Search`, {
        params: { parametro, page: pagina }
    });
};

export const registrar = (descripcion) => {
    return api.post(`Unidad`, {
        params: { nombreUnidad: descripcion }
    });
};

export const actualizar = (id, descripcion) => {
    return api.put(`Unidad`, {
        params: { id, nombreUnidad: descripcion }
    });
};