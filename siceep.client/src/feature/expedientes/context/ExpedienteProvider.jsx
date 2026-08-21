import React, { useState, useCallback } from 'react';
import { ExpedienteContext } from './ExpedienteContext';

// Estado inicial del expediente (vacío)
const ExpedienteInicial = {
    persona: { pnombre: '', papellido: '' }, // campos obligatorios
    empleado: {},
    contrato: {},
    contactoEmergencia: null,
    caracteristicasFisicas: null,
    familiares: [],
};

export const ExpedienteProvider = ({ children }) => {
    const [expediente, setExpediente] = useState(ExpedienteInicial);

    // Actualiza una sección completa
    const actualizarSeccion = useCallback((seccion, data) => {
        setExpediente((prev) => ({
            ...prev,
            [seccion]: data,
        }));
    }, []);

    // Actualiza un campo específico dentro de una sección
    const actualizarCampo = useCallback((section, field, value) => {
        setExpediente((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    }, []);

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
    };

    return (
        <ExpedienteContext.Provider value={value}>
            {children}
        </ExpedienteContext.Provider>
    );
};

export default ExpedienteProvider;
