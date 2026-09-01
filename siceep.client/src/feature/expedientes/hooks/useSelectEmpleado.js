import { useEffect, useState } from "react";
import { selectEstado } from './../services/expedienteService';

export const useSelectEmpleado = () => {

    const [selEstado, setSelEstado] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const cargarSelect = async () => {
            try {
                const res = await selectEstado();
                if (!isMounted) return;

                // mapear datos
                setSelEstado(res.data);

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

    return { selEstado, loading };
};