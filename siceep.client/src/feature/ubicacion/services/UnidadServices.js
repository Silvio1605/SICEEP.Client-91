import api from "./../../../api/api";

export const getUnidades = (parametro, pagina) => {
    return api.get(`Unidad/Search`, {
        params: { parametro, page: pagina }
    });
};

export const registrar = (nombreUnidad) => {
    return api.post(`Unidad`, null, {
        params: { nombreUnidad }
    });
};

export const actualizar = (id, nombreUnidad) => {
    console.log(nombreUnidad);
    return api.put(`Unidad`, null, {
        params: { id, nombreUnidad }
    });
};