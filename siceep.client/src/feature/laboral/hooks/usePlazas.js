import { useState, useEffect, useCallback } from 'react';
import { getPlazas, registrarPlaza } from './../services/laboralServices';

export const usePlazas = () => {
    const [plazas, setPlazas] = useState([]);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cargar = useCallback(async (params) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getPlazas(params);
            setPlazas(res?.data?.data || []);
            setTotalRegistros(res?.data?.totalRegistros || 0);
        } catch (e) {
            setError(e?.response?.data?.message || e?.message || "Error al cargar las plazas");
            setPlazas([]);
            setTotalRegistros(0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const ejecutar = async () => {
            await cargar({ page: 1, pageSize: 10 });
        };
        ejecutar();
    }, [cargar]);

    const guardarPlaza = async (data) => {
        const res = await registrarPlaza(data);
        return res?.data || {};
    };

    return { plazas, totalRegistros, loading, error, cargar, guardarPlaza };
};