import api from "./../../../api/api";

export const getEstructuras = (parametro, pagina) => {
    return api.get(`Estructura/Search`, {
        params: { parametro, page: pagina }
    });
};

export const Registrar = (descripcion, orden) => {
    return api.post(`Estructura`, {
        params: { nombreEstructura : descripcion, orden }
    }); 
};

export const Actualizar = (id, descripcion) => {
    return api.put(`Estructura`, {
        params: { id, nombreEstructura : descripcion }
    });
};
