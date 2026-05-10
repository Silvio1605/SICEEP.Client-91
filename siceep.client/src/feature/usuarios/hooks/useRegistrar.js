import { useState }from 'react';
import { BuscarPropietario } from '../services/usuarioService';

export const useRegistrar = () => {
    const [propietarios, setPropietarios] = useState([]);

    const buscar = async (param) => {

        if (param == "" || param == null) return;

        const res = await BuscarPropietario(param);
        setPropietarios(res.data);
    };

    


    return { propietarios, buscar };
};