import { useState }from 'react';
import { BuscarPropietario, BuscarUsuario } from '../services/usuarioService';
import { registrarUsuario } from './../services/usuarioService';

const nuevoUsuario = async (registro) => {

    const {
        nombrePropietario: _,
        ...usuario
    } = registro;

    return await registrarUsuario(usuario);
};

export const useRegistrar = () => {

    const [propietarios, setPropietarios] = useState([]);
    const [cargando, setCargando] = useState(false);

    const buscar = async (param, OriginRegistro) => {

        if (param == "" || param == null) {
            setPropietarios([]);
            return;
        }

        setCargando(true);
        try {
            const res = OriginRegistro
                ? await BuscarPropietario(param)
                : await BuscarUsuario(param);

            setPropietarios(res?.data ?? []);
        } catch {
            setPropietarios([]);
        } finally {
            setCargando(false);
        }
    };

    return { propietarios, cargando, buscar, nuevoUsuario };
};