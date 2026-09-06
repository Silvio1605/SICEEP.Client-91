import { useState, useEffect, useCallback } from 'react';
import { getCargos } from './../services/laboralServices';

export const useCargos = () => {
    const [cargos, setCargos] = useState([]);
    const [loading, setLoading] = useState(false);

    const cargar = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getCargos();
            setCargos(res?.data || []);
        } catch {
            setCargos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const ejecutar = async () => {
            await cargar();
        };
        ejecutar();
    }, [cargar]);

    return { cargos, loading, cargar };
};