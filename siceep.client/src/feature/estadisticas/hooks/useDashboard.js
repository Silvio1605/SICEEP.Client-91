import { useState, useEffect, useCallback } from 'react';
import { getDashboard } from './../services/dashboardService';

export const useDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargar = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getDashboard();
            setData(res?.data || null);
        } catch (e) {
            setError(e?.response?.data?.message || e?.message || "No se pudieron cargar las estadísticas.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let activo = true;
        const inicializar = async () => {
            try {
                const res = await getDashboard();
                if (activo) {
                    setData(res?.data || null);
                    setError(null);
                }
            } catch (e) {
                if (activo) setError(e?.response?.data?.message || e?.message || "No se pudieron cargar las estadísticas.");
            } finally {
                if (activo) setLoading(false);
            }
        };
        inicializar();
        return () => { activo = false; };
    }, []);

    return { data, loading, error, recargar: cargar };
};