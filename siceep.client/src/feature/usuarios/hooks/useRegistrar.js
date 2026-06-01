import { useState }from 'react';
import { BuscarPropietario } from '../services/usuarioService';
import { registrarUsuario } from './../services/usuarioService';

export const useRegistrar = () => {
    const [propietarios, setPropietarios] = useState([]);

    const buscar = async (param) => {

        if (param == "" || param == null) return;

        const res = await BuscarPropietario(param);
        setPropietarios(res.data);
    };

    const nuevoUsuario = async (registro) => {

        const {
            nombrePropietario: _,
            ...usuario
        } = registro;

        return await registrarUsuario(usuario);
    };

    return { propietarios, buscar, nuevoUsuario };
};