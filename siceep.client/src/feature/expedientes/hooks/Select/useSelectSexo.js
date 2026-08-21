import { useEffect, useState } from "react";
import { getSelectSexo } from '../../services/expedienteService';

export const useSelectSexo = () => {
    const [selSexo, setSelSexo] = useState([]);
    const [loadingS, setLoadingS] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const cargarSelect = async () => {
            try {
                const roles = await getSelectSexo();

                if (!isMounted) return;
                setSelSexo(roles.data);

            } catch (error) {
                console.error("Error cargando selects:", error);
            } finally {
                if (isMounted) setLoadingS(false);
            }
        };

        cargarSelect();

        return () => {
            isMounted = false;
        };
    }, []);

    return { selSexo, loadingS };
};

