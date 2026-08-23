import React, { useState, useCallback } from 'react';
import { ExpedienteContext } from './ExpedienteContext';

// Estado inicial del expediente (vacío)
const ExpedienteInicial = {
    persona: { pnombre: '', papellido: '' }, // campos obligatorios
    contrato: {},
    contactoEmergencia: null,
    caracteristicasFisicas: null,
    familiares: [],
};

const SeccionesEstadoInicial = {
    persona: { completado: false, obligatorio: true },
    contrato: { completado: false, obligatorio: true },
    contactoEmergencia: { completado: false, obligatorio: false },
    caracteristicasFisicas: { completado: false, obligatorio: false },
    familiares: { completado: false, obligatorio: false },
};

export const ExpedienteProvider = ({ children }) => {

    const [expediente, setExpediente] = useState(ExpedienteInicial);
    const [estadoSecciones, setEstadoSecciones] = useState(SeccionesEstadoInicial);

    // Función que verifica si una sección está completa
    const verificarSeccionCompleta = (seccion, data) => {

        if (!data) return false;

        switch (seccion) {
            case 'persona':
                return !!data.pnombre && !!data.papellido;
            case 'contrato':
                return !!data.idPlaza && !!data.salarioMensual;
            case 'contactoEmergencia':
                return !!(data.nombreContacto && data.telefono);
            case 'caracteristicasFisicas':
                return !!(data.estatura && data.peso);
            case 'familiares':
                return Array.isArray(data) && data.length > 0;
            default:
                return false;
        }
    };

    // Actualiza una sección y marca su estado
    const actualizarSeccion = useCallback((seccion, data) => {
        setExpediente((prev) => ({
            ...prev,
            [seccion]: data,
        }));
        // Marcar como completada si tiene datos
        const estaCompleta = verificarSeccionCompleta(seccion, data);
        setEstadoSecciones((prev) => ({
            ...prev,
            [seccion]: {
                ...prev[seccion],
                completado: estaCompleta,
            },
        }));
    }, []);
   
    // Actualiza un campo específico dentro de una sección
    const actualizarCampo = useCallback((seccion, campo, valor) => {
        setExpediente((prev) => {
            const nuevaSeccion = {
                ...prev[seccion],
                [campo]: valor,
            };
            return {
                ...prev,
                [seccion]: nuevaSeccion,
            };
        });

        // Verificar si la sección quedó completa después del cambio
        // (Se hace después de setExpediente, pero usamos el valor actualizado)
        // Para simplificar, lo hacemos en un useEffect o en la misma función con setTimeout
        setTimeout(() => {
            setEstadoSecciones((prev) => {
                const seccionActual = expediente[seccion];
                const estaCompleta = verificarSeccionCompleta(seccion, seccionActual);
                return {
                    ...prev,
                    [seccion]: {
                        ...prev[seccion],
                        completado: estaCompleta,
                    },
                };
            });
        }, 0);
    }, [expediente]);


    // Resetea todo el formulario
    const resetExpediente = useCallback(() => {
        setExpediente(ExpedienteInicial);
    }, []);

    // Carga un expediente completo
    const setExpedienteCompleto = useCallback((data) => {
        setExpediente(data);
    }, []);

    const value = {
        expediente,
        actualizarSeccion,
        actualizarCampo,
        resetExpediente,
        setExpedienteCompleto,
        estadoSecciones, 
    };

    return (
        <ExpedienteContext.Provider value={value}>
            {children}
        </ExpedienteContext.Provider>
    );
};

export default ExpedienteProvider;
