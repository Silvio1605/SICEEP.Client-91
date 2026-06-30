import { useState, useEffect, useCallback } from 'react';

export const useGenericFetch = (fetchFn, initialParam = "", initialPage = 1) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [param, setParam] = useState(initialParam);
    const [page, setPage] = useState(initialPage);

    const fetchData = useCallback(async (newParam, newPage) => {
        try {
            setLoading(true);
            setError(null);

            const p = newParam !== undefined ? newParam : param;
            const pg = newPage !== undefined ? newPage : page;

            const response = await fetchFn(p, pg);
            console.log(response.data);
            setData(response.data.data);

            if (newParam !== undefined) setParam(newParam);
            if (newPage !== undefined) setPage(newPage);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [param, page, fetchFn]);

    // Carga inicial
    useEffect(() => {
        fetchData(initialParam, initialPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const search = (newParam, newPage) => {
        fetchData(newParam, newPage);
    };

    return { data, loading, error, refetch: fetchData, search, param, page };
};