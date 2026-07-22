import { useCallback, useState } from "react";

export const useGenericFetch = (fetchFn) => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [param, setParam] = useState("");
    const [page, setPage] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);

    const search = useCallback(async (newParam = "", newPage = 1) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetchFn(newParam, newPage);

            setData(response.data.data);
            setTotalRegistros(response.data.totalRegistros);
            setParam(newParam);
            setPage(newPage);

        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [fetchFn]);

    return {
        data,
        loading,
        error,
        param,
        page,
        totalRegistros,
        search
    };
};
