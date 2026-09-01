import { useEffect, useState } from "react";
import { getSelectCaracteristicas } from '../../services/expedienteService';

export const useSelectCaracteristicas = () => {
    const [selCaracteristicas, setSelCaracteristicas] = useState([]);
    const [loadingCaracteristicas, setLoadingCaracteristicas] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const cargarSelect = async () => {
            try {
                const caracteristicas = await getSelectCaracteristicas();
                if (!isMounted) return;
                setSelCaracteristicas(caracteristicas.data);

            } catch (error) {
                console.error("Error cargando selects:", error);
            } finally {
                if (isMounted) setLoadingCaracteristicas(false);
            }
        };

        cargarSelect();

        return () => {
            isMounted = false;
        };
    }, []);

    return { selCaracteristicas, loadingCaracteristicas };
};

