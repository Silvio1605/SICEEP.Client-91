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

    // Estado para controlar si cada sección está completa o no
    const [seccionesCompletas, setSeccionesCompletas] = useState({
        persona: false,
        empleado: false,
        contrato: false,
        contactoEmergencia: false,
        caracteristicasFisicas: false,
        familiares: false,
        estudios: false,
        documentos: false
    });


    const actualizarSeccionCompleta = useCallback((seccion, data) => {
        if (!data) {
            setSeccionesCompletas(prev => ({ ...prev, [seccion]: false }));
            return;
        }

        // campos obligatorios para cada sección
        const camposObligatorios = {
            persona: ['pnombre', 'papellido', 'sexo'],
            empleado: ['numInss', 'fechaIngreso', 'idEstadoEmpleado'],
            contrato: ['idPlaza', 'fechaInicio', 'tipoContrato', 'salarioMensual'],
            contactoEmergencia: ['nombreContacto', 'telefono'],
            caracteristicasFisicas: ['tonoPiel', 'colorOjos'],
            familiares: (data) => Array.isArray(data) && data.length > 0,
        };

        const esCompleta = (seccion, data) => {
            if (seccion === 'familiares') {
                return Array.isArray(data) && data.length > 0;
            }
            const campos = camposObligatorios[seccion];
            if (!campos) return false;
            return campos.every(campo => {
                const valor = data?.[campo];
                return valor !== undefined && valor !== null && valor !== '' && valor !== 0;
            });
        };

        setSeccionesCompletas(prev => ({
            ...prev,
            [seccion]: esCompleta(seccion, data)
        }));
    }, []);

    // Actualiza una sección completa
    const actualizarSeccion = useCallback((seccion, data) => {
        setExpediente(prev => {
            const nuevo = { ...prev, [seccion]: data };
            actualizarSeccionCompleta(seccion, data);
            return nuevo;
        });
    }, [actualizarSeccionCompleta]);
   
    // Actualiza un campo específico dentro de una sección
    const actualizarCampo = useCallback((seccion, campo, valor) => {
        setExpediente(prev => {
            const nuevo = {
                ...prev,
                [seccion]: {
                    ...prev[seccion],
                    [campo]: valor
                }
            };
            // Llamar a actualizarSeccionCompleta con los nuevos datos
            actualizarSeccionCompleta(seccion, nuevo[seccion]);
            return nuevo;
        });
    }, [actualizarSeccionCompleta]);

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
        seccionesCompletas  
    };

    return (
        <ExpedienteContext.Provider value={value}>
            {children}
        </ExpedienteContext.Provider>
    );
};

export default ExpedienteProvider;
