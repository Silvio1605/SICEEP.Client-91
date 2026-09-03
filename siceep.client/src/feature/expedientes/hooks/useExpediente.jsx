import * as React from 'react';
import { getExpedientes } from '../services/expedienteService';

export const useExpediente = () => {
    const [expedientes, setExpedinetes] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState();

    const buscar = async (filtro) => {

        //validaciones
        if (filtro.estado === "") {
            filtro.estado = null;
        }

        const res = await getExpedientes(filtro);
        const pagina = res.data.pagina;
        const paginaActual = Number(pagina) || 1;
        const pageSize = 10;

        setExpedinetes((res.data.data || []).map((item, index) => ({
            ...item,
            index: (paginaActual - 1) * pageSize + index + 1,
        })));
        setPage(pagina);
        setTotal(res.data.totalRegistros);
    };



    return { expedientes, buscar, page, total };
}
