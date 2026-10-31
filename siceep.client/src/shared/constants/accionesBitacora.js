// Id_Accion de dbo.Tipo_Accion usados al registrar manualmente en la bitácora
// (POST /api/Bitacora/Registrar). Deben coincidir con el catálogo del servidor.
export const ACCION_BITACORA = Object.freeze({
    VER: 1,
    REGISTRAR: 2,
    ACTUALIZAR: 3,
    REESTABLECER_CONTRASENA: 4,
    ASIGNAR_PERMISOS: 5,
    BAJA: 6,
    REACTIVAR: 7,
    ELIMINAR: 8,
    GENERAR_CONSTANCIA: 9,
    GENERAR_REPORTE: 10,
    DESCARGAR_DOCUMENTO: 11,
    GUARDAR_DOCUMENTO: 12,
    REGISTRAR_EXPEDIENTE: 13,
});
