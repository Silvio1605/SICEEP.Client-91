import { useState, useEffect, useRef } from 'react';
import { validarSeccion, esquemaValidacion } from '../utils/validacionExpediente';
import _ from 'lodash';

export const useProgresoExpediente = (expediente) => {
    const prevExpedienteRef = useRef();

    const computeProgreso = (exp) => {
        const secciones = ['persona', 'empleado', 'contrato', 'contactoEmergencia', 'caracteristicasFisicas', 'familiares'];

        const resultado = {};
        let completas = 0;
        let totalObligatorias = 0;
        let totalOpcionales = 0;
        let opcionalesCompletas = 0;

        secciones.forEach(seccion => {
            const datos = exp[seccion];
            const validacion = validarSeccion(seccion, datos);
            resultado[seccion] = validacion;

            if (validacion.estado === 'completa') {
                completas++;
                if (esquemaValidacion[seccion]?.seccionObligatoria) {
                    // Es obligatoria y está completa
                } else {
                    opcionalesCompletas++;
                }
            }

            if (esquemaValidacion[seccion]?.seccionObligatoria) {
                totalObligatorias++;
            } else {
                totalOpcionales++;
            }
        });

        const totalSecciones = secciones.length;
        const porcentaje = Math.round((completas / totalSecciones) * 100);

        return {
            ...resultado,
            resumen: {
                completas,
                totalSecciones,
                porcentaje,
                obligatoriasCompletas: completas - opcionalesCompletas,
                totalObligatorias,
                opcionalesCompletas,
                totalOpcionales
            }
        };
    };

    // Estado que contiene el progreso calculado
    const [progreso, setProgreso] = useState(() => computeProgreso(expediente));

    // Compara y actualiza fuera del render
    useEffect(() => {
        // Si es la primera renderización, inicializamos el ref sin re-calcular el estado
        if (prevExpedienteRef.current === undefined) {
            prevExpedienteRef.current = expediente;
            return;
        }

        // Sólo recalcular si el expediente cambió realmente (comparación profunda)
        if (!_.isEqual(prevExpedienteRef.current, expediente)) {
            prevExpedienteRef.current = expediente;
            setProgreso(computeProgreso(expediente));
        }
    }, [expediente]);

    return progreso;
};
