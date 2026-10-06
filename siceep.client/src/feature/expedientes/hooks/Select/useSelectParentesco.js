import { useEffect, useState } from 'react';
import { getSelectParentescos, getSelectTipoUnion } from '../../services/expedienteService';

// Catalogos que necesita el formulario de nucleo familiar. Si alguno falla se
// degrada a lista vacia: el formulario sigue permitiendo escribir, solo pierde
// el selector de tipo de parentesco y el de tipo de union.
export const useSelectParentesco = () => {
    const [parentescos, setParentescos] = useState([]);
    const [tiposUnion, setTiposUnion] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const cargar = async () => {
            try {
                const [parentescosRes, unionRes] = await Promise.all([
                    getSelectParentescos().catch(() => ({ data: [] })),
                    getSelectTipoUnion().catch(() => ({ data: [] })),
                ]);
                if (!isMounted) return;
                setParentescos(parentescosRes?.data || []);
                setTiposUnion(unionRes?.data || []);
            } catch (error) {
                console.error('Error cargando catalogos de nucleo familiar:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        cargar();

        return () => {
            isMounted = false;
        };
    }, []);

    return { parentescos, tiposUnion, loading };
};

// Sexo que impone el catalogo: "M" o "F" son fijos, "A" (ambos) no obliga.
export const sexoSegunParentesco = (parentesco, sexoEmpleado) => {
    if (!parentesco) return '';
    if (parentesco.generoAplicable === 'M') return 'M';
    if (parentesco.generoAplicable === 'F') return 'F';
    if (parentesco.esConyuge) {
        return sexoEmpleado === 'M' ? 'F' : sexoEmpleado === 'F' ? 'M' : 'F';
    }
    return '';
};

// Un descendiente tiene dos entradas en el catalogo (HIJO / HIJA) que se
// distinguen por el sexo. Si el sexo no esta definido todavia no se puede elegir.
export const ajustarDescendiente = (familiar, catalogos) => {
    if (!familiar?.idParentesco) return familiar;

    const actual = catalogos.find((p) => p.id === Number(familiar.idParentesco));
    if (!actual?.esDescendiente) return familiar;

    const opciones = catalogos.filter((p) => p.esDescendiente);
    if (opciones.length < 2) return familiar;

    const correcto = opciones.find((p) => p.generoAplicable === familiar.sexo);
    if (!correcto || correcto.id === Number(familiar.idParentesco)) return familiar;

    return { ...familiar, idParentesco: correcto.id };
};
