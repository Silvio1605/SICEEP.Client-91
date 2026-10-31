import { useState, useEffect, useCallback } from 'react';
import { getBitacora, getAcciones } from './../service/bitacoraService';

export const useBitacora = () => {

    // estado para almacenar el historial de la bitácora
    const [historial, setHistorial] = useState([]);

    // estado para almacenar las opciones del select de acciones
    const [selAccion, setSelAccion] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cargandoHistorial, setCargandoHistorial] = useState(false);
    const [total, setTotal] = useState(0);

    const buscar = useCallback(async (filtro) => {
        const pagina = Number(filtro.pagina) > 0 ? Number(filtro.pagina) : 1;
        const tamañoPagina = Number(filtro.tamañoPagina) > 0 ? Number(filtro.tamañoPagina) : 10;

        const filtroApi = {
            busqueda: filtro.busqueda || filtro.usuario || null,
            usuario: filtro.usuario || null,
            fecha: filtro.fecha || null,
            accion: Number(filtro.accion) || 0,
            pagina,
            tamañoPagina
        };

        setCargandoHistorial(true);
        try {
            const res = await getBitacora(filtroApi);
            const desplazamiento = (pagina - 1) * tamañoPagina;

            setHistorial((res.data.data || []).map((item, index) => ({
                ...item,
                // Numeración continua entre páginas, como en las demás tablas.
                index: desplazamiento + index + 1,
            })));
            setTotal(Number(res.data.totalRegistros) || 0);
        } finally {
            setCargandoHistorial(false);
        }
    }, []);

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

    return { historial, buscar, selAccion, loading, total, cargandoHistorial };
}
