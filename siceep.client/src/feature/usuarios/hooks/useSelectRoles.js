import { useEffect, useState } from "react";
import { getSelectRoles } from './../services/selectService';

export const useSelectRoles = () => {
    const [selRol, setSelRol] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const cargarSelect = async () => {
            try {
                const roles = await getSelectRoles();

                if (!isMounted) return;
                setSelRol(roles.data);

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

    return { selRol, loading };
};

