import api from "./../../../api/api";

export const getEstructuras = (parametro, pagina) => {
    return api.get(`Estructura/Search`, {
        params: { parametro, page: pagina }
    });
};

export const Registrar = (descripcion, orden) => {
    return api.post(`Estructura`, null, {
        params: { nombreEstructura : descripcion, orden }
    }); 
};

export const Actualizar = (id, descripcion) => {
    return api.put(`Estructura`, null, {
        params: { id, nombreEstructura : descripcion }
    });
};
