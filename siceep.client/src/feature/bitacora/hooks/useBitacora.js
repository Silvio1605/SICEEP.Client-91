import { useState, useEffect } from 'react';
import { getBitacora, getAcciones } from './../service/bitacoraService'; 

export const useBitacora = () => {

    // estado para almacenar el historial de la bitácora
    const [historial, setHistorial] = useState([]);

    // estado para almacenar las opciones del select de acciones
    const [selAccion, setSelAccion] = useState([]);
    const [loading, setLoading] = useState(true);

    const buscar = async (filtro) => {

        //validaciones
        if (filtro.estado === "") {
            filtro.estado = null;
        }
        //definir el tamaño de la paginacion
        filtro.pagina = 1;
        filtro.tamañoPagina = 10;

        const res = await getBitacora(filtro);

        setHistorial(res.data.data);
    };

    useEffect(() => {
        let isMounted = true;

        const cargarSelect = async () => {
            try {
                const res = await getAcciones();
                if (!isMounted) return;
                // mapear datos
                setSelAccion(res.data);

            } catch (error) {
                console.error("Error cargando selects:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        cargarSelect();

        return () => {
            isMounted = false;
        };
    }, []);

    return { historial, buscar, selAccion, loading };
}