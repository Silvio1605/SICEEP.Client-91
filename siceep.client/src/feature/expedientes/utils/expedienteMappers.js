// normaliza fechas del backend a 'YYYY-MM-DD' (lo que entienden los inputs date)
export const aISO = (valor) => {
    if (!valor) return '';
    if (valor instanceof Date && !Number.isNaN(valor.getTime())) return valor.toISOString().slice(0, 10);
    const texto = String(valor);
    if (/^\d{4}-\d{2}-\d{2}/.test(texto)) return texto.slice(0, 10);
    return texto;
};

// Fecha del backend (DateTime o DateOnly) a ISO 8601 para el DTO del PUT
const aISOCompleto = (valor) => {
    if (!valor) return null;
    if (valor instanceof Date) return valor.toISOString();
    const texto = aISO(valor);
    if (!texto) return null;
    return new Date(`${texto}T12:00:00`).toISOString();
};


// Formatea una fecha del backend a 'dd/mm/aaaa' para mostrar en pantalla
export const formatearFechaLegible = (valor) => {
    const iso = aISO(valor);
    if (!iso) return null;
    const [anio, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${anio}`;
};

export const nombreCompletoPersona = (p = {}) =>
    [p.papellido, p.sapellido, p.pnombre, p.snombre].filter(Boolean).join(' ').trim();

export const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;
    const nacimiento = new Date(aISO(fechaNacimiento));
    if (Number.isNaN(nacimiento.getTime())) return null;
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad -= 1;
    return edad;
};

export const nombreEstadoCivil = (idEstadoCivil) => {
    const catalogo = { 1: 'SOLTERO', 2: 'CASADO', 1002: 'UNION DE HECHO' };
    return catalogo[idEstadoCivil] || 'NO DISPONIBLE';
};

export const nombreSexo = (sexo) => {
    if (sexo === 'F') return 'FEMENINO';
    if (sexo === 'M') return 'MASCULINO';
    return 'NO DISPONIBLE';
};

export const nombreTipoContrato = (tipoContrato) => {
    const catalogo = { P: 'PLANTA', A: 'AUXILIAR' };
    return catalogo[tipoContrato] || tipoContrato || 'NO DISPONIBLE';
};

// Genera un identificador estable para la clave de React. No se usa el indice
// porque al reordenar o eliminar un familiar los campos se cruzarian.
export const generarClave = (prefijo = 'familiar') =>
    (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `${prefijo}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

// Familiar vacio. tipoUnion/observaciones solo se usan cuando el parentesco es
// conyuge; el resto de la lista los ignora.
export const familiarVacio = (idParentesco = '', clave) => ({
    id: clave || generarClave(),
    idParentesco: idParentesco || '',
    tipoUnion: '',
    observaciones: '',
    fechaInicio: '',
    fechaFin: '',
    idRelacion: null,
    idPersonaDestino: null,
    pnombre: '',
    snombre: '',
    papellido: '',
    sapellido: '',
    sexo: '',
    cedula: '',
    fechaNacimiento: ''
});

// Convierte la lista de familiares de la API (con idParentesco) al estado del
// formulario. A diferencia del molde antiguo, aqui NO se deduce el parentesco
// desde la posicion: se conserva el que ya tiene en la base de datos.
const mapearFamiliaresANucleo = (familiares = []) => ({
    familiares: (familiares || [])
        .filter((f) => f && f.activo !== false)
        .map((f) => {
            const p = f.persona || {};
            return {
                id: f.idRelacion != null ? `rel-${f.idRelacion}` : generarClave(),
                idParentesco: f.idParentesco ?? '',
                tipoUnion: f.tipoUnion || '',
                observaciones: f.observaciones || '',
                fechaInicio: f.fechaInicio ? aISO(f.fechaInicio) : '',
                fechaFin: f.fechaFin ? aISO(f.fechaFin) : '',
                idRelacion: f.idRelacion ?? null,
                idPersonaDestino: p.idPersona ?? null,
                pnombre: p.pnombre || '',
                snombre: p.snombre || '',
                papellido: p.papellido || '',
                sapellido: p.sapellido || '',
                sexo: p.sexo || '',
                cedula: p.cedula || '',
                fechaNacimiento: aISO(p.fechaNacimiento),
            };
        })
});

// Mapea ExpedienteCompletoDto (respuesta del GET) al objeto que consume el contexto (edición)
export const mapearCompletoAFormulario = (dto) => {
    const persona = dto?.persona || {};
    const contrato = dto?.contrato || null;
    const plaza = dto?.plaza || null;
    const contacto = dto?.contactoEmergencia || null;
    const caracteristicas = dto?.caracteristicasFisicas || null;

    return {
        idEmpleado: dto?.idEmpleado,
        idExpediente: dto?.idExpediente,
        documentos: dto?.documentos || [],
        persona: {
            idPersona: persona.idPersona,
            pnombre: persona.pnombre || '',
            snombre: persona.snombre || '',
            papellido: persona.papellido || '',
            sapellido: persona.sapellido || '',
            cedula: persona.cedula || '',
            sexo: persona.sexo || 'M',
            estadoCivil: persona.idEstadoCivil || 1,
            fechaNacimiento: aISO(persona.fechaNacimiento),
            lugarNacimiento: persona.lugarNacimiento || '',
            direccion: persona.direccion || '',
            celular: persona.celular || '',
        },
        contrato: {
            idContrato: contrato?.idContrato,
            ordinal: contrato?.ordinal || '',
            numInss: contrato?.numInss || dto?.numInss || '',
            tipoContrato: contrato?.tipoContrato || 'P',
            fechaInicio: contrato?.fechaInicio ? aISO(contrato.fechaInicio) : '',
            fechaCese: contrato?.fechaCese ? aISO(contrato.fechaCese) : null,
            salarioMensual: Number(contrato?.salarioMensual) || 0,
            plaza: plaza
                ? {
                    ordinal: plaza.ordinal,
                    orden: plaza.orden,
                    estructura: plaza.estructura,
                    unidad: plaza.unidad,
                    cargo: plaza.cargo,
                    categoria: plaza.categoria,
                    salario: plaza.salario,
                }
                : null,
        },
        contactoEmergencia: contacto
            ? { idContacto: contacto.idContacto, nombreContacto: contacto.nombreContacto || '', telefono: contacto.telefono || '', referencia: contacto.referencia || '', parentesco: contacto.parentesco || '' }
            : null,
        caracteristicasFisicas: caracteristicas
            ? {
                idCaracteristica: caracteristicas.idCaracteristica,
                estatura: caracteristicas.estatura ?? 0,
                peso: caracteristicas.peso ?? 0,
                tonoPiel: caracteristicas.tonoPiel || '',
                colorOjos: caracteristicas.colorOjos || '',
                colorCabello: caracteristicas.colorCabello || '',
                tipoCabello: caracteristicas.tipoCabello || '',
            }
            : null,
        nucleoFamiliar: mapearFamiliaresANucleo(dto?.familiares || []),
    };
};

// Mapea ExpedienteCompletoDto al formato que ya consumen los componentes 'ver'
export const mapearCompletoADetalle = (dto) => {
    const persona = dto?.persona || {};
    const nombre = nombreCompletoPersona(persona);

    const familiares = (dto?.familiares || [])
        .filter((f) => f && f.activo !== false)
        .map((f) => ({
            id: f.idRelacion,
            parentesco: f.nombreParentesco || 'FAMILIAR',
            identificacion: f.persona?.cedula || 'S/D',
            nombre: nombreCompletoPersona(f.persona),
            observacion: f.observaciones || '',
        }));

    return {
        idEmpleado: dto?.idEmpleado,
        nombreCompleto: nombre || 'NOMBRE NO DISPONIBLE',
        numeroExpediente: dto?.numeroExpediente || '',
        cedula: persona.cedula || '',
        sexo: persona.sexo === 'F' ? 'FEMENINO' : persona.sexo === 'M' ? 'MASCULINO' : 'NO DISPONIBLE',
        edad: calcularEdad(persona.fechaNacimiento),
        estadoCivil: null,
        lugarNacimiento: persona.lugarNacimiento || '',
        direccion: persona.direccion || '',
        celular: persona.celular || '',
        familiares,
    };
};

// Construye el ExpedienteActualizarDto para el PUT. Los familiares conservan
// sus ids (idRelacion/idPersonaDestino); los que se eliminen en el formulario
// simplemente no se envían y el backend los marca como Activo = false.
export const construirPayloadActualizar = (expediente) => {
    const persona = expediente.persona || {};
    const contrato = expediente.contrato || {};
    const contacto = expediente.contactoEmergencia || {};
    const caracteristicas = expediente.caracteristicasFisicas || {};
    const nucleo = expediente.nucleoFamiliar || {};

    const construirPersona = (p, sexoPorDefecto) => ({
        cedula: (p.cedula ?? '').trim(),
        pnombre: (p.pnombre ?? '').trim(),
        snombre: (p.snombre ?? '').trim(),
        papellido: (p.papellido ?? '').trim(),
        sapellido: (p.sapellido ?? '').trim(),
        fechaNacimiento: p.fechaNacimiento ? aISOCompleto(p.fechaNacimiento) : null,
        sexo: p.sexo ? p.sexo : sexoPorDefecto,
        idEstadoCivil: p.idEstadoCivil ?? 1,
        direccion: p.direccion ?? '',
        lugarNacimiento: p.lugarNacimiento ?? '',
        celular: (p.celular ?? '').trim(),
    });

    // El idParentesco lo elige el usuario en el selector, no se deduce de la
    // posicion. tipoUnion solo viaja para el conyuge, igual que en el backend.
    //
    // Solo se descartan las filas NUEVAS que estan totalmente vacias. Las que ya
    // tienen IdRelacion deben viajar siempre: el backend da de baja toda relacion
    // que no llegue en el DTO, asi que filtrar aqui borraria al familiar.
    const filaVacia = (f) =>
        ![f.pnombre, f.snombre, f.papellido, f.sapellido, f.cedula, f.fechaNacimiento]
            .some((v) => String(v ?? '').trim());

    const familiares = (nucleo.familiares || [])
        .filter((f) => f && (f.idRelacion > 0 || !filaVacia(f)))
        .map((f) => ({
            idEmpleado: expediente.idEmpleado || 0,
            idRelacion: f.idRelacion ?? null,
            idPersonaDestino: f.idPersonaDestino ?? null,
            idParentesco: Number(f.idParentesco) || 0,
            fechaInicio: f.fechaInicio || null,
            fechaFin: f.fechaFin || null,
            tipoUnion: f.tipoUnion || '',
            observaciones: f.observaciones || '',
            fechaCreacion: new Date().toISOString(),
            persona: construirPersona(f, f.sexo),
        }));

    return {
        persona: {
            idPersona: persona.idPersona,
            ...construirPersona(persona, 'M'),
        },
        contrato: {
            idContrato: contrato.idContrato,
            tipoContrato: contrato.tipoContrato ?? 'P',
            fechaInicio: contrato.fechaInicio ? aISO(contrato.fechaInicio) : '',
            fechaCese: contrato.fechaCese ? aISO(contrato.fechaCese) : null,
            numInss: (contrato.numInss ?? '').toString().trim(),
            salarioMensual: Number(contrato.salarioMensual) || 0,
        },
        contactoEmergencia: contacto.nombreContacto
            ? {
                idContacto: contacto.idContacto ?? null,
                nombreContacto: contacto.nombreContacto ?? '',
                telefono: contacto.telefono ?? '',
                referencia: contacto.referencia ?? '',
                parentesco: contacto.parentesco ?? '',
            }
            : null,
        caracteristicasFisicas: caracteristicas.estatura
            ? {
                idCaracteristica: caracteristicas.idCaracteristica ?? null,
                estatura: Number(caracteristicas.estatura) || 0,
                peso: Number(caracteristicas.peso) || 0,
                tonoPiel: caracteristicas.tonoPiel ?? '',
                colorOjos: caracteristicas.colorOjos ?? '',
                colorCabello: caracteristicas.colorCabello ?? '',
                tipoCabello: caracteristicas.tipoCabello ?? '',
            }
            : null,
        familiares,
    };
};