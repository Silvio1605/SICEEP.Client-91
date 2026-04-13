import { useEffect, useState } from "react";
import { getSelectUsuario } from './../services/selectService'; 

export const useSelectUsuarios = () => {
    const [selEstado, setSelEstado] = useState([]);
    const [selAño, setSelAño] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const cargarSelect = async () => {
            try {
                const res = await getSelectUsuario();

                if (!isMounted) return;
                // mapear datos
                setSelEstado(res.data.Estados);
                setSelAño(res.data.Años);

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

    return { selEstado, selAño, loading };
};
