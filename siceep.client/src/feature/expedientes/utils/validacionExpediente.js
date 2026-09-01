// utils/validacionExpediente.js
export const esquemaValidacion = {
    persona: {
        camposObligatorios: ['pnombre', 'papellido', 'fechaNacimiento', 'sexo'],
        seccionObligatoria: true
    },
    contrato: {
        camposObligatorios: ['ordinal', 'numInss', 'tipoContrato',  'fechaInicio', 'salarioMensual'],
        seccionObligatoria: true
    },
    contactoEmergencia: {
        camposObligatorios: ['nombreContacto', 'telefono'],
        seccionObligatoria: false // Opcional
    },
    caracteristicasFisicas: {
        camposObligatorios: ['estatura','peso'], // Ningún campo obligatorio
        seccionObligatoria: false // Opcional
    },
    familiares: {
        camposObligatorios: [], // Si no hay familiares, está "completo"
        seccionObligatoria: false // Opcional
    }
};

export const validarSeccion = (seccion, datos) => {
    const esquema = esquemaValidacion[seccion];
    if (!esquema) return { completa: false, faltantes: [] };

    // Si la sección es opcional y está vacía, lse considera "completa" (no aplica)
    if (!esquema.seccionObligatoria && !datos) {
        return { completa: true, faltantes: [], estado: 'no_aplica' };
    }

    // Si la sección es opcional y tiene datos, validamos campos obligatorios
    const faltantes = esquema.camposObligatorios.filter(
        campo => !datos?.[campo] || datos[campo] === '' || datos[campo] === null
    );

    return {
        completa: faltantes.length === 0,
        faltantes,
        estado: faltantes.length === 0 ? 'completa' : 'incompleta'
    };
};

// ------------------------------------------------------------------
// Validación de CALIDAD de los datos (cédula, fechas, estatura, peso)
// ------------------------------------------------------------------

// Alfabeto oficial del dígito verificador de la cédula nicaragüense (Módulo 23, sin I ni O)
export const LETRAS_CEDULA = 'ABCDEFGHJKLMNPQRSTUVWXY';

export const RANGOS_VALIDOS = {
    estatura: { min: 1.0, max: 2.4 },   // metros
    peso: { min: 45, max: 700 }         // libras
};

// Quita guiones, puntos y espacios de una cédula y la pasa a mayúsculas
export const limpiarCedula = (valor = '') => String(valor).replace(/[-.\s]/g, '').toUpperCase();

// Valida el formato 000-000000-0000X y la letra verificadora (Módulo 23)
export const esCedulaValida = (valor) => {
    const limpia = limpiarCedula(valor);
    if (!/^\d{13}[A-Z]$/.test(limpia)) return false;

    const numerica = BigInt(limpia.slice(0, 13));
    const letraEsperada = LETRAS_CEDULA[Number(numerica % 23n)];
    return limpia[13] === letraEsperada;
};

// Valida fecha de nacimiento: debe existir, no ser futura ni anterior a 1900
export const validarFechaNacimiento = (valor) => {
    if (!valor) return { valida: false, mensaje: 'Falta la fecha de nacimiento' };

    const texto = String(valor).slice(0, 10);
    const [anio, mes, dia] = texto.split('-').map(Number);
    if (texto.length !== 10 || [anio, mes, dia].some(Number.isNaN)) {
        return { valida: false, mensaje: 'Formato de fecha inválido' };
    }

    const fecha = new Date(anio, mes - 1, dia);
    if (fecha.getFullYear() !== anio || fecha.getMonth() !== mes - 1 || fecha.getDate() !== dia) {
        return { valida: false, mensaje: 'La fecha no existe (día o mes incorrectos)' };
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fecha.getTime() > hoy.getTime()) {
        return { valida: false, mensaje: 'La fecha no puede ser futura' };
    }
    if (anio < 1900) {
        return { valida: false, mensaje: 'La fecha es anterior a 1900 (verifique el año)' };
    }

    return { valida: true };
};

// Valida estatura en metros (rango humano plausible)
export const validarEstatura = (valor) => {
    const v = Number(valor);
    if (!valor || Number.isNaN(v) || v <= 0) {
        return { valida: false, mensaje: 'Indique la estatura en metros' };
    }
    if (v < RANGOS_VALIDOS.estatura.min || v > RANGOS_VALIDOS.estatura.max) {
        return {
            valida: false,
            mensaje: `Debe estar entre ${RANGOS_VALIDOS.estatura.min} y ${RANGOS_VALIDOS.estatura.max} metros`
        };
    }
    return { valida: true };
};

// Valida peso en libras (rango humano plausible)
export const validarPeso = (valor) => {
    const v = Number(valor);
    if (!valor || Number.isNaN(v) || v <= 0) {
        return { valida: false, mensaje: 'Indique el peso en libras' };
    }
    if (v < RANGOS_VALIDOS.peso.min || v > RANGOS_VALIDOS.peso.max) {
        return {
            valida: false,
            mensaje: `Debe estar entre ${RANGOS_VALIDOS.peso.min} y ${RANGOS_VALIDOS.peso.max} libras`
        };
    }
    return { valida: true };
};

// Valida la calidad de TODOS los datos antes de guardar.
// Devuelve un arreglo de problemas: { seccion, campo, mensaje }
// Solo se reportan los campos que tienen información (las secciones opcionales
// vacías no generan problemas).
export const validarCalidadExpediente = (expediente = {}) => {
    const errores = [];

    const persona = expediente.persona || {};
    const caracteristicas = expediente.caracteristicasFisicas || {};
    const nucleo = expediente.nucleoFamiliar || {};

    const validarCedulaPersona = (cedula, etiqueta) => {
        if (cedula && String(cedula).trim() && !esCedulaValida(cedula)) {
            errores.push({
                seccion: 'cedula',
                campo: 'cedula',
                mensaje: `La cédula de ${etiqueta} (${cedula}) no es válida. Formato esperado: 000-000000-0000 con letra correcta.`
            });
        }
    };

    // ¿Funcionario?
    const fn = validarFechaNacimiento(persona.fechaNacimiento);
    if (!fn.valida) {
        errores.push({ seccion: 'persona', campo: 'fechaNacimiento', mensaje: `Fecha de nacimiento del funcionario: ${fn.mensaje}.` });
    }
    validarCedulaPersona(persona.cedula, 'funcionario');

    // Características físicas (solo si tiene al menos un valor)
    if (caracteristicas?.estatura || caracteristicas?.peso) {
        if (caracteristicas?.estatura) {
            const e = validarEstatura(caracteristicas.estatura);
            if (!e.valida) errores.push({ seccion: 'caracteristicasFisicas', campo: 'estatura', mensaje: `Estatura: ${e.mensaje}.` });
        }
        if (caracteristicas?.peso) {
            const p = validarPeso(caracteristicas.peso);
            if (!p.valida) errores.push({ seccion: 'caracteristicasFisicas', campo: 'peso', mensaje: `Peso: ${p.mensaje}.` });
        }
    }

    // Núcleo familiar
    const etiquetasNucleo = { madre: 'la madre', padre: 'el padre', conyuge: 'el cónyuge' };
    Object.entries(etiquetasNucleo).forEach(([clave, etiqueta]) => {
        const f = nucleo?.[clave];
        if (!f) return;

        validarCedulaPersona(f.cedula, etiqueta);
        if (f.fechaNacimiento) {
            const r = validarFechaNacimiento(f.fechaNacimiento);
            if (!r.valida) errores.push({ seccion: 'nucleoFamiliar', campo: `${clave}.fechaNacimiento`, mensaje: `Fecha de nacimiento de ${etiqueta}: ${r.mensaje}.` });
        }
    });

    (nucleo?.hijos || []).forEach((hijo, indice) => {
        validarCedulaPersona(hijo.cedula, `el hijo #${indice + 1}`);
        if (hijo.fechaNacimiento) {
            const r = validarFechaNacimiento(hijo.fechaNacimiento);
            if (!r.valida) errores.push({ seccion: 'nucleoFamiliar', campo: 'hijo.fechaNacimiento', mensaje: `Fecha de nacimiento del hijo #${indice + 1}: ${r.mensaje}.` });
        }
    });

    return errores;
};
