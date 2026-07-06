import { useState }from 'react';
import { BuscarPropietario, BuscarUsuario } from '../services/usuarioService';
import { registrarUsuario } from './../services/usuarioService';

export const useRegistrar = () => {
    const [propietarios, setPropietarios] = useState([]);

    const buscar = async (param, OriginRegistro) => {

        if (param == "" || param == null) return;
        var res;

        if (OriginRegistro) {
            res = await BuscarPropietario(param);
        } else {
            res = await BuscarUsuario(param);
        }
        
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
