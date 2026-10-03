// Id_Recurso de dbo.Recurso. El servidor resuelve cada endpoint por el nombre
// del recurso (PermisoRequirement), asi que la UI debe usar el mismo Id para
// que lo que se ve coincida con lo que la API autoriza.
export const RECURSO = Object.freeze({
    REESTABLECER_CONTRASENA: 1,
    REGISTRAR_USUARIO: 2,
    ACTUALIZAR_ESTADO_CUENTA: 3,
    ACTUALIZAR_EXPIRACION_CUENTA: 4,
    REGISTRAR_EXPEDIENTE: 5,
    CONSULTAR_EXPEDIENTES: 6,
    ACTUALIZAR_EXPEDIENTE: 7,
    FORMACION_ACADEMICA: 8,
    DOCUMENTOS_EXPEDIENTE: 9,
    GESTION_BAJAS: 10,
    BUSQUEDA_RAPIDA: 11,
    GENERAR_CONSTANCIAS: 12,
    PLAZAS_Y_CARGOS: 13,
    MOVIMIENTOS_Y_RECORRIDO: 14,
    DEDUCCIONES: 15,
    FUERZA_LABORAL: 16,
    ALTAS_Y_BAJAS: 17,
    PANEL_INDICADORES: 18,
    INSTITUCIONES_ACADEMICAS: 19,
    ESTRUCTURAS: 20,
    UBICACIONES_Y_UNIDADES: 21,
    ASIGNAR_PERMISOS: 1002,
    GESTIONAR_ROLES: 1003,
    HISTORIAL_ACTIVIDAD: 1004,
});

// tienePermiso acepta un id o una lista y responde con semantica OR.
// Para exigir varios recursos a la vez (leer y escribir, por ejemplo) se
// necesita AND, que no existe todavia en AuthProvider.
export const requiereTodos = (tienePermiso, ids) =>
    [].concat(ids).every((id) => tienePermiso(id));
