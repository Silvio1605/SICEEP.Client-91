import * as React from 'react';
import { getUsuarios } from '../services/usuarioService';

export const useUsuarios = () => {
    const [usuarios, setUsuariosData] = React.useState([]);

    const buscar = async (filtro) => {

        //validaciones
        if (filtro.estado === "") {
            filtro.estado = null;
        }
        //definir el tamaño de la paginacion
        filtro.pagina = 1;
        filtro.tamañoPagina = 10;

        const res = await getUsuarios(filtro);
        setUsuariosData(res.data.data);
    };

    return { usuarios, buscar };
}

