import { useState, useCallback } from 'react';
import { crearExpediente } from './../services/expedienteService';

export function useRegistroExpediente() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const registrar = useCallback(async (expediente) => {
        setLoading(true);
        setError(null);

        try {
            const response = await crearExpediente(expediente);
            setData(response.data); // axios devuelve la respuesta en .data
            return response.data;
        } catch (err) {
            // El error ya fue procesado por el interceptor, pero aquí lo capturamos para el estado local
            const errorObj = err instanceof Error ? err : new Error(String(err));
            setError(errorObj);
            throw errorObj;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setData(null);
    }, []);

    return { registrar, loading, error, data, reset };
}

