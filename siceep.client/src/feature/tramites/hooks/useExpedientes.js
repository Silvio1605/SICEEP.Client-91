import { useState, useEffect, useCallback } from 'react';
import { getExpedientes } from '../../expedientes/services/expedienteService';

// Encapsula la búsqueda y paginación de expedientes para Búsqueda Rápida
export default function useExpedientes(debounceMs = 400) {

    const [expedientes, setExpedientes] = useState([]);
    const [total, setTotal] = useState(0);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [page, setPage] = useState(0);

    const cargarExpedientes = useCallback(async (termino, pagina) => {
        setCargando(true);
        setError(null);
        try {
            const filtro = {
                busqueda: termino && termino.trim() !== '' ? termino.trim() : null,
                estado: null,
                estructura: null,
                cargo: null,
                pagina: pagina + 1,
            };
            const res = await getExpedientes(filtro);
            setExpedientes(res?.data?.data || []);
            setTotal(res?.data?.totalRegistros || 0);
        } catch (err) {
            setError(err?.message || 'Error al cargar los expedientes.');
            setExpedientes([]);
            setTotal(0);
        } finally {
            setCargando(false);
        }
    }, []);

    // Debounce de la búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            const termino = busqueda && busqueda.trim() !== '' ? busqueda.trim() : null;
            cargarExpedientes(termino, page);
        }, debounceMs);
        return () => clearTimeout(timer);
    }, [busqueda, page, cargarExpedientes, debounceMs]);

    const manejarBusqueda = useCallback((event) => {
        setBusqueda(event.target.value);
        setPage(0);
    }, []);

    const cambiarPagina = useCallback((event, nuevaPagina) => {
        setPage(nuevaPagina);
    }, []);

    return { expedientes, total, cargando, error, busqueda, page, manejarBusqueda, cambiarPagina };
}