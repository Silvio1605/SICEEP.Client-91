import { useState, useEffect } from 'react';
// servicios
import { getUsuariosById, getEstructura } from './../../usuarios/services/usuarioService';

export const usePerfil = (id) => {
    // información del perfil (usuario y estructura)
    const [perfil, setPerfil] = useState({
        usuario: null,
        estructura: null
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const cargar = async () => {
            // Si no hay ID, no hacer nada
            if (!id) return;

            // obtener permisos y estructura del usuario
            const [estructura, usuario] = await Promise.all([
                getEstructura(id),
                getUsuariosById(id)
            ]);
            setPerfil({
                usuario: usuario.data,
                estructura: estructura.data
            });
            setLoading(false);
        };

        cargar();

    }, [id]);

    return { loading, perfil };
};

