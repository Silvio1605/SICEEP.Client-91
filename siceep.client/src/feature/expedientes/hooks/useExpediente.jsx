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

        setExpedinetes(res.data.data);
        setPage(res.data.pagina);
        setTotal(res.data.totalRegistros);
    };

    return { expedientes, buscar, page, total };
}