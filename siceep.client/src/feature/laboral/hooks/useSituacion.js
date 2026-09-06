import { useState, useCallback } from 'react';
import { getSituacion, getHistorial, registrarMovimiento } from './../services/laboralServices';

export const useSituacion = () => {
    const [situacion, setSituacion] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cargarSituacion = useCallback(async (idEmpleado) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getSituacion(idEmpleado);
            setSituacion(res?.data || null);
        } catch (e) {
            const status = e?.response?.status;
            if (status !== 404) {
                setError(e?.response?.data?.message || e?.message || "No se pudo cargar la situación laboral.");
            }
            setSituacion(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const cargarHistorial = useCallback(async (idEmpleado) => {
        try {
            const res = await getHistorial(idEmpleado);
            setHistorial(res?.data || []);
        } catch {
            setHistorial([]);
        }
    }, []);

    const moverEmpleado = async (payload) => {
        const res = await registrarMovimiento(payload);
        return res?.data || {};
    };

    return { situacion, historial, loading, error, cargarSituacion, cargarHistorial, moverEmpleado };
};