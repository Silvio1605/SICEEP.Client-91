import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ExpedienteContext } from './ExpedienteContext';

// Clave del borrador en localStorage
const CACHE_KEY = 'siceep_expediente_borrador_v1';

// Estado inicial del expediente
const ExpedienteInicial = {
    persona: { pnombre: '', papellido: '', sexo: 'M', fechaNacimiento: null }, // campos obligatorios
    contrato: { ordinal: null, numInss: '', tipoContrato: 'P', fechaInicio: null, fechaCese: null, salarioMensual: 0, plaza: null },
    contactoEmergencia: null,
    caracteristicasFisicas: null,
    familiares: [],
    nucleoFamiliar: {
        madre: { pnombre: '', snombre: '', papellido: '', sapellido: '', sexo: 'F', cedula: '', fechaNacimiento: '' },
        padre: { pnombre: '', snombre: '', papellido: '', sapellido: '', sexo: 'M', cedula: '', fechaNacimiento: '' },
        conyuge: { pnombre: '', snombre: '', papellido: '', sapellido: '', sexo: '', cedula: '', fechaNacimiento: '', tipoUnion: '', observaciones: '' },
        hijos: []
    }
};

const SeccionesEstadoInicial = {
    persona: { completado: false, obligatorio: true },
    contrato: { completado: false, obligatorio: true },
    contactoEmergencia: { completado: false, obligatorio: false },
    caracteristicasFisicas: { completado: false, obligatorio: false },
    familiares: { completado: false, obligatorio: false },
};

// Funcion que verifica si una seccion esta completa (independiente del componente)
const verificarSeccionCompleta = (seccion, data) => {
    if (!data) return false;

    switch (seccion) {
        case 'persona':
            return !!data.pnombre && !!data.papellido;
        case 'contrato':
            return !!data.ordinal && !!data.salarioMensual;
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

// Mezcla el borrador guardado con el esquema inicial (defensivo ante cambios de estructura)
const mezclarBorrador = (guardado) => ({
    ...ExpedienteInicial,
    ...guardado,
    persona: { ...ExpedienteInicial.persona, ...(guardado.persona || {}) },
    contrato: { ...ExpedienteInicial.contrato, ...(guardado.contrato || {}) },
    contactoEmergencia: guardado.contactoEmergencia ?? null,
    caracteristicasFisicas: guardado.caracteristicasFisicas ?? null,
    familiares: guardado.familiares || [],
    nucleoFamiliar: {
        ...ExpedienteInicial.nucleoFamiliar,
        ...(guardado.nucleoFamiliar || {}),
        madre: { ...ExpedienteInicial.nucleoFamiliar.madre, ...(guardado.nucleoFamiliar?.madre || {}) },
        padre: { ...ExpedienteInicial.nucleoFamiliar.padre, ...(guardado.nucleoFamiliar?.padre || {}) },
        conyuge: { ...ExpedienteInicial.nucleoFamiliar.conyuge, ...(guardado.nucleoFamiliar?.conyuge || {}) },
        hijos: guardado.nucleoFamiliar?.hijos || []
    }
});

// Carga el borrador desde localStorage (null si no existe o es inv�lido)
const cargarBorrador = () => {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const guardado = JSON.parse(raw);
        if (!guardado || typeof guardado !== 'object') return null;
        return mezclarBorrador(guardado);
    } catch {
        return null;
    }
};

export const ExpedienteProvider = ({ children }) => {

    const [expediente, setExpediente] = useState(() => cargarBorrador() ?? ExpedienteInicial);
    const [estadoSecciones, setEstadoSecciones] = useState(() => {
        const borrador = cargarBorrador();
        if (!borrador) return SeccionesEstadoInicial;
        const estados = { ...SeccionesEstadoInicial };
        Object.keys(estados).forEach((seccion) => {
            estados[seccion] = {
                ...estados[seccion],
                completado: verificarSeccionCompleta(seccion, borrador[seccion]),
            };
        });
        return estados;
    });
    const [ultimoGuardado, setUltimoGuardado] = useState(null);
    const omitirAutoguardado = useRef(false);

    // Autoguardado: persiste el borrador cada vez que cambia el expediente
    useEffect(() => {
        if (omitirAutoguardado.current) {
            omitirAutoguardado.current = false;
            return;
        }
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(expediente));
            queueMicrotask(() => setUltimoGuardado(new Date()));
        } catch {
            // Almacenamiento no disponible (cuota llena o modo privado): ignora silenciosamente
        }
    }, [expediente]);

    // Actualiza una seccion y marca su estado
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

    // Actualiza un campo especifico dentro de una seccion
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

        // Verificar si la secci�n qued� completa despu�s del cambio
        // (Se hace despu�s de setExpediente, pero usamos el valor actualizado)
        // Para simplificar, lo hacemos en un useEffect o en la misma funci�n con setTimeout
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

    // Resetea todo el formulario y limpia el borrador guardado
    const resetExpediente = useCallback(() => {
        omitirAutoguardado.current = true;
        setExpediente(ExpedienteInicial);
        setEstadoSecciones(SeccionesEstadoInicial);
        setUltimoGuardado(null);
        try {
            localStorage.removeItem(CACHE_KEY);
        } catch {
            // sin almacenamiento disponible
        }
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
        ultimoGuardado,
    };

    return (
        <ExpedienteContext.Provider value={value}>
            {children}
        </ExpedienteContext.Provider>
    );
};

export default ExpedienteProvider;