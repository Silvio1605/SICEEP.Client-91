import { useState, useCallback } from 'react';
import { crearExpediente } from './../services/expedienteService';

// Traduce la lista del formulario al payload de familiares.
// El idParentesco viene del selector que eligio el usuario. Solo se descartan
// las filas sin tipo de parentesco o sin ningun nombre: antes se descartaba
// tambien a quien no tuviera fecha de nacimiento, y ese dato se perdia en
// silencio junto con tipo de unión y observaciones.
const transformarNucleoAFamiliares = (expediente) => {
    const nucleo = expediente.nucleoFamiliar || {};
    const idEmpleado = expediente.idEmpleado || 0;

    return (nucleo.familiares || [])
        .filter((f) => f && f.idParentesco)
        .filter((f) => [f.pnombre, f.snombre, f.papellido, f.sapellido].some((n) => String(n || '').trim()))
        .map((f) => ({
            idEmpleado: idEmpleado,
            idFamiliar: 0, // el backend lo asigna
            idParentesco: Number(f.idParentesco),
            fechaInicio: f.fechaInicio || null,
            fechaFin: f.fechaFin || null,
            tipoUnion: f.tipoUnion || '',
            observaciones: f.observaciones || '',
            fechaCreacion: new Date().toISOString(),
            persona: {
                cedula: (f.cedula ?? '').trim(),
                pnombre: (f.pnombre ?? '').trim(),
                snombre: (f.snombre ?? '').trim(),
                papellido: (f.papellido ?? '').trim(),
                sapellido: (f.sapellido ?? '').trim(),
                fechaNacimiento: f.fechaNacimiento || null,
                sexo: f.sexo || '',
                idEstadoCivil: f.idEstadoCivil || 1,
                direccion: f.direccion || '',
                lugarNacimiento: f.lugarNacimiento || '',
                celular: (f.celular ?? '').trim()
            }
        }));
};

// Construye el payload SOLO con los campos que espera ExpedienteRegistroDto
const construirPayloadRegistro = (expediente, familiares) => {
    const persona = expediente.persona || {};
    const contrato = expediente.contrato || {};
    const contacto = expediente.contactoEmergencia || {};
    const caracteristicas = expediente.caracteristicasFisicas || {};

    return {
        persona: {
            cedula: (persona.cedula ?? '').trim(),
            pnombre: (persona.pnombre ?? '').trim(),
            snombre: (persona.snombre ?? '').trim(),
            papellido: (persona.papellido ?? '').trim(),
            sapellido: (persona.sapellido ?? '').trim(),
            fechaNacimiento: persona.fechaNacimiento ? new Date(persona.fechaNacimiento).toISOString() : null,
            sexo: persona.sexo ?? 'M',
            idEstadoCivil: persona.idEstadoCivil ?? 1,
            direccion: persona.direccion ?? '',
            lugarNacimiento: persona.lugarNacimiento ?? '',
            celular: (persona.celular ?? '').trim()
        },
        contrato: {
            ordinal: (contrato.ordinal ?? '').toString().trim(),
            tipoContrato: contrato.tipoContrato ?? 'P',
            fechaInicio: contrato.fechaInicio ?? '',
            fechaCese: contrato.fechaCese ?? null,
            numInss: (contrato.numInss ?? '').toString().trim(),
            salarioMensual: Number(contrato.salarioMensual) || 0
        },
        contactoEmergencia: contacto.nombreContacto ? {
            nombreContacto: contacto.nombreContacto ?? '',
            telefono: contacto.telefono ?? '',
            referencia: contacto.referencia ?? '',
            parentesco: contacto.parentesco ?? ''
        } : null,
        caracteristicasFisicas: caracteristicas.estatura ? {
            estatura: Number(caracteristicas.estatura) || 0,
            peso: Number(caracteristicas.peso) || 0,
            tonoPiel: caracteristicas.tonoPiel ?? '',
            colorOjos: caracteristicas.colorOjos ?? '',
            colorCabello: caracteristicas.colorCabello ?? '',
            tipoCabello: caracteristicas.tipoCabello ?? ''
        } : null,
        familiares
    };
};

export function useRegistroExpediente() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const registrar = useCallback(async (expediente) => {
        setLoading(true);
        setError(null);

        try {
            // Transformar el n�cleo familiar a la estructura de familiares (infiere el sexo por parentesco)
            const familiaresTransformados = transformarNucleoAFamiliares(expediente);

            // Construir el objeto de forma expl�cita (sin propagar todo el expediente)
            const expedientePayload = construirPayloadRegistro(expediente, familiaresTransformados);

            console.log('Payload para crear expediente:', expedientePayload);

            // Llamar al servicio para crear el expediente
            const response = await crearExpediente(expedientePayload);

            // axios devuelve la respuesta en .data
            setData(response.data); 
            return response.data;
        } catch (err) {
            // El error ya fue procesado por el interceptor, pero aqu� lo capturamos para el estado local
            const errorObj = err instanceof Error ? err : new Error(String(err));
            setError(errorObj);
            throw errorObj;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setData(null);
    }, []);

    return { registrar, loading, error, data, reset };
}

