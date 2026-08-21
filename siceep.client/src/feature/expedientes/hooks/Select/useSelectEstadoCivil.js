import { useEffect, useState } from "react";
import { getSelectEstCivil } from '../../services/expedienteService';

export const useSelectEstadoCivil = () => {
    const [selECivil, setSelECivil] = useState([]);
    const [loadingEC, setLoadingEC] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const cargarSelect = async () => {
            try {
                const roles = await getSelectEstCivil();
                if (!isMounted) return;
                setSelECivil(roles.data);

            } catch (error) {
                console.error("Error cargando selects:", error);
            } finally {
                if (isMounted) setLoadingEC(false);
            }
        };

        cargarSelect();

        return () => {
            isMounted = false;
        };
    }, []);

    return { selECivil, loadingEC };
};
