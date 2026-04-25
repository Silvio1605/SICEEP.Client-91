import { useState, useEffect, useRef } from 'react'; 
// servicios
import { getPermisos, getEstructura } from './../services/PermisoService';
import { getUsuariosById } from './../../usuarios/services/usuarioService'; 

export const usePermisos = (id) => {

    //permisos originales para comparar cambios
    const permisosOriginal = useRef([]);
    //permisos actuales para mostrar en la interfaz
    const [permisos, setPermisosData] = useState([]);
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
            const [res, estructura, usuario] = await Promise.all([
                getPermisos(id),
                getEstructura(id),
                getUsuariosById(id)
            ]);
            // datos para mostrar permisos con su estado
            setPermisosData(res.data);
            setPerfil({
                usuario: usuario.data,
                estructura: estructura.data
            });
            // ref para mantener los permisos originales y comparar cambios
            permisosOriginal.current = JSON.parse(JSON.stringify(res.data));
            setLoading(false);
        };

        cargar();
        
    }, [id]);

    // Local - Función para cambiar el estado de un permiso
    const cambiarPermiso = (idPermiso) => {
        setPermisosData(prev =>
            prev.map(modulo => ({
                ...modulo,
                permisos: modulo.permisos.map(p =>
                    p.idRecurso === idPermiso
                        ? { ...p, check: !p.check }
                        : p
                )
            }))
        );
    };

    // Export - Función para obtener una lista plana de todos los permisos
    const obtenerPermisos = (data) =>
        data.flatMap(m => m.permisos);
    // Export - Función para detectar cambios entre los permisos actuales y los originales
    const detectarCambios = () => {
        const originales = obtenerPermisos(permisosOriginal.current);
        const actuales = obtenerPermisos(permisos);

        // Convertir originales a mapa
        const mapaOriginal = new Map(
            originales.map(o => [o.idRecurso, o.check])
        );

        // recorrer el mapeado para encontrar el id del recurso
        const cambios = actuales.reduce((acc, p) => {
            const originalCheck = mapaOriginal.get(p.idRecurso);

            //que no sea indefinido y sea distito al original
            if (originalCheck !== undefined && originalCheck !== p.check) {
                acc.push({
                    idRecurso: p.idRecurso,
                    recurso: p.recurso,
                    descripcion: p.descripcion,
                    estado: p.check ? 1 : 0
                });
            }
            return acc;
        }, []);

        return cambios;
    };

    return { loading, perfil, permisos, permisosOriginal, detectarCambios, cambiarPermiso };
}