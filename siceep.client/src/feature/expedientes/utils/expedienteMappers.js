// normaliza fechas del backend a 'YYYY-MM-DD' (lo que entienden los inputs date)
export const aISO = (valor) => {
    if (!valor) return '';
    if (valor instanceof Date && !Number.isNaN(valor.getTime())) return valor.toISOString().slice(0, 10);
    const texto = String(valor);
    if (/^\d{4}-\d{2}-\d{2}/.test(texto)) return texto.slice(0, 10);
    return texto;
};

// Formatea una fecha del backend a 'dd/mm/aaaa' para mostrar en pantalla
export const formatearFechaLegible = (valor) => {
    const iso = aISO(valor);
    if (!iso) return null;
    const [anio, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${anio}`;
};

// Fecha del backend (DateTime o DateOnly) a ISO 8601 para el DTO del PUT
const aISOCompleto = (valor) => {
    if (!valor) return null;
    if (valor instanceof Date) return valor.toISOString();
    const texto = aISO(valor);
    if (!texto) return null;
    return new Date(`${texto}T12:00:00`).toISOString();
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

// Convierte la familia (con ids de BD) en los slots que espera TabNucleofamiliar.
// Cada familiar conserva idRelacion/idPersonaDestino para reconciliar el PUT.
const mapearFamiliaresANucleo = (familiares = []) => {
    const vacio = () => ({ pnombre: '', snombre: '', papellido: '', sapellido: '', sexo: '', cedula: '', fechaNacimiento: '' });

    const nucleo = { madre: vacio(), padre: vacio(), conyuge: { ...vacio(), tipoUnion: '', observaciones: '' }, hijos: [] };

    familiares
        .filter((f) => f && f.activo !== false)
        .forEach((f) => {
            const p = f.persona || {};
            const datos = {
                ...vacio(),
                pnombre: p.pnombre || '',
                snombre: p.snombre || '',
                papellido: p.papellido || '',
                sapellido: p.sapellido || '',
                sexo: p.sexo || '',
                cedula: p.cedula || '',
                fechaNacimiento: aISO(p.fechaNacimiento),
                idRelacion: f.idRelacion,
                idPersonaDestino: f.idPersona,
            };

            if (f.idParentesco === 4) {
                nucleo.madre = { ...datos, sexo: 'F' };
            } else if (f.idParentesco === 5) {
                nucleo.padre = { ...datos, sexo: 'M' };
            } else if (f.idParentesco === 1) {
                nucleo.conyuge = { ...datos, tipoUnion: f.tipoUnion || '', observaciones: f.observaciones || '' };
            } else {
                nucleo.hijos.push({ ...datos, id: String(f.idRelacion) });
            }
        });

    return nucleo;
};

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

    const sexoEmpleado = persona.sexo;
    const sexoConyuge = sexoEmpleado === 'M' ? 'F' : sexoEmpleado === 'F' ? 'M' : 'F';

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

    const familiares = [];

    const agregarFamiliar = (familiar, idParentesco, sexoPorDefecto) => {
        if (!familiar || !familiar.fechaNacimiento) return;
        familiares.push({
            idEmpleado: expediente.idEmpleado || 0,
            idRelacion: familiar.idRelacion ?? null,
            idPersonaDestino: familiar.idPersonaDestino ?? null,
            idParentesco,
            fechaInicio: familiar.fechaInicio || null,
            fechaFin: familiar.fechaFin || null,
            tipoUnion: familiar.tipoUnion || '',
            observaciones: familiar.observaciones || '',
            fechaCreacion: new Date().toISOString(),
            persona: construirPersona(familiar, sexoPorDefecto),
        });
    };

    agregarFamiliar(nucleo.madre, 4, 'F');
    agregarFamiliar(nucleo.padre, 5, 'M');
    agregarFamiliar(nucleo.conyuge, 1, sexoConyuge);

    (nucleo.hijos || []).forEach((hijo) => {
        agregarFamiliar(hijo, hijo.sexo === 'F' ? 3 : 2, hijo.sexo === 'F' ? 'F' : 'M');
    });

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