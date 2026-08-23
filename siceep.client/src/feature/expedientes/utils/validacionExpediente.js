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
