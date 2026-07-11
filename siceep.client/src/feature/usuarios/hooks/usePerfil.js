// servicios
import { getUsuariosById, getEstructura } from './../../usuarios/services/usuarioService';
import { useEffect, useState, useCallback } from "react";

export const usePerfil = (id) => {

    const [perfil, setPerfil] = useState({
        usuario: null,
        estructura: null
    });

    const [loading, setLoading] = useState(false);

    // función reutilizable
    const cargar = useCallback(async () => {

        if (!id) return;

        try {

            setLoading(true);

            const [estructura, usuario] = await Promise.all([
                getEstructura(id),
                getUsuariosById(id)
            ]);
            
            setPerfil({
                usuario: usuario.data,
                estructura: estructura.data
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    }, [id]);

    useEffect(() => {
        cargar();
    }, [cargar]);

    // devolver también la función reload
    return { loading, perfil, reload: cargar };
};

