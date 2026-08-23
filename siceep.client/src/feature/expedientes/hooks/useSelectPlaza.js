import { useState, useCallback } from 'react';
import { searchPlaza, getPlaza } from './../services/expedienteService'; // ajusta ruta }

export const useSelectPlaza = () => {
    const [plazas, setPlazas] = useState([]);
    const [plazaSeleccionada, setPlazaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const buscarPlazas = useCallback(async (ordinal, top = 20) => {
        setLoading(true);
        setError(null);
        try {
            const response = await searchPlaza(ordinal, top);
            setPlazas(response.data || []);
            
            return response.data;
        } catch (err) {
            setError(err.message || 'Error al buscar plazas');
            setPlazas([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const obtenerPlaza = useCallback(async (ordinal) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPlaza(ordinal);
            setPlazaSeleccionada(response.data || null);
            return response.data;
        } catch (err) {
            setError(err.message || 'Error al obtener la plaza');
            setPlazaSeleccionada(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setPlazas([]);
        setPlazaSeleccionada(null);
        setError(null);
        setLoading(false);
    }, []);

    return {
        plazas,
        plazaSeleccionada,
        loading,
        error,
        buscarPlazas,
        obtenerPlaza,
        reset
    };
};