import { useState, useCallback } from 'react';
import { crearExpediente } from './../services/expedienteService';

// Transforma el n�cleo familiar a la estructura de familiares.
// Recibe el expediente completo para poder inferir el sexo por parentesco cuando no venga.
const transformarNucleoAFamiliares = (expediente) => {
    const nucleo = expediente.nucleoFamiliar || {};
    const idEmpleado = expediente.idEmpleado || 0;
    const sexoEmpleado = expediente.persona?.sexo;
    const resultado = [];

    // Mapeo de clave -> idParentesco (ajusta seg�n tu cat�logo)
    const parentescos = {
        madre: 4,    
        padre: 5,
        conyuge: 2,
        hijo: 2, // todos los hijos usan este mismo id
        hija: 3
    };

    // Funci�n auxiliar para agregar un familiar si tiene al menos fecha de nacimiento
    const agregar = (persona, parentescoId, sexoPorDefecto = '') => {
        if (!persona || !persona.fechaNacimiento) return; // opcional: solo si tiene fecha de nacimiento
        resultado.push({
            idEmpleado: idEmpleado,
            idFamiliar: 0, // el backend lo asignar� o puedes generar uno temporal
            idParentesco: parentescoId,
            fechaInicio: null,
            fechaFin: null,
            tipoUnion: '',
            observaciones: '',
            fechaCreacion: new Date().toISOString(),
            persona: {
                cedula: persona.cedula || '',
                pnombre: persona.pnombre || '',
                snombre: persona.snombre || '',
                papellido: persona.papellido || '',
                sapellido: persona.sapellido || '',
                fechaNacimiento: persona.fechaNacimiento || '',
                sexo: persona.sexo ? persona.sexo : sexoPorDefecto,
                idEstadoCivil: persona.idEstadoCivil || 1,
                direccion: persona.direccion || '',
                lugarNacimiento: persona.lugarNacimiento || '',
                celular: persona.celular || ''
            }
        });
    };

    // Agregar madre y padre con su sexo por defecto
    agregar(nucleo.madre, parentescos.madre, 'F');
    agregar(nucleo.padre, parentescos.padre, 'M');

    // El c�nyuge normalmente es del sexo contrario al empleado
    const sexoConyuge = sexoEmpleado === 'M' ? 'F' : sexoEmpleado === 'F' ? 'M' : 'F';
    agregar(nucleo.conyuge, parentescos.conyuge, sexoConyuge);

    // Agregar hijos (todos con parentesco HIJO), respetando el sexo de cada uno
    if (nucleo.hijos && nucleo.hijos.length) {
        nucleo.hijos.forEach(hijo => agregar(hijo, parentescos.hijo));
    }

    return resultado;
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

