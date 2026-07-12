import { useState, useEffect, useCallback } from 'react'; 
// servicios
import { getPermisos } from './../services/PermisoService';


// Export - Función para obtener una lista plana de todos los permisos
const obtenerPermisos = (data) =>
    data.flatMap(m => m.permisos);

export const usePermisos = (id) => {

    //permisos originales para comparar cambios
    const [permisosOriginal, setPermisosOriginal] = useState([]);

    //permisos actuales para mostrar en la interfaz
    const [permisos, setPermisosData] = useState([]);
    
    const [loading, setLoading] = useState(false);

    const cargar = useCallback(async () => {
        setLoading(true);
        // Si no hay ID, no hacer nada
        if (!id) {
            setLoading(false);
            return;
        }
        // obtener permisos y estructura del usuario
        const res = await getPermisos(id);
        // datos para mostrar permisos con su estado
        setPermisosData(res.data);
        // ref para mantener los permisos originales y comparar cambios
        setPermisosOriginal(
            structuredClone(res.data)
        );
    }, [id]);

    useEffect(() => {
        const ejecutar = async () => {
            await cargar();
        };

        ejecutar();
    }, [cargar]);

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

    // Export - Función para detectar cambios entre los permisos actuales y los originales
    const detectarCambios = () => {
        const originales = obtenerPermisos(permisosOriginal);
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

    const PermisosModificados = (() => {

        const lista = detectarCambios();

        return {
            cambios: lista,
            agregados: lista.filter(x => x.estado === 1),
            quitados: lista.filter(x => x.estado === 0)
        };

    })();

    return { loading, permisos, permisosOriginal, detectarCambios, cambiarPermiso, refetch: cargar, PermisosModificados };
}

