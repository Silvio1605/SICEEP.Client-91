import Usuarios from "../feature/usuarios/pages/usuarios";
import Index from "../feature/permisos/pages/index";
import Bitacora from "../feature/bitacora/page/bitacora";
import Ubicacion from "../feature/ubicacion/page/ubicacion";
import Expedientes from "../feature/expedientes/pages/Expedientes";
import DetalleExpediente from "../feature/expedientes/pages/DetalleExpediente";
import CrearExpediente from "../feature/expedientes/pages/CrearExpediente";
import EditarExpediente from "../feature/expedientes/pages/EditarExpediente";
import BusquedaRapida from "../feature/tramites/pages/BusquedaRapida";
import GestionDocumentos from "../feature/documentos/pages/GestionDocumentos";
import Plazas from "../feature/laboral/pages/Plazas";
import Movimientos from "../feature/laboral/pages/Movimientos";
import Deducciones from "../feature/laboral/pages/Deducciones";
import InstitucionesAcademicas from "../feature/academico/pages/InstitucionesAcademicas";
import ConsultaAcademica from "../feature/academico/pages/ConsultaAcademica";
import Dashboard from "../feature/estadisticas/pages/Dashboard";
import HerramientasAyuda from "../feature/ayuda/pages/HerramientasAyuda";
import Reportes from "../feature/reportes/pages/Reportes";
import Configuracion from "../feature/configuracion/pages/Configuracion";
import { Navigate } from "react-router-dom";
import { RECURSO } from "../shared/constants/recursos";

// Context Providers
import { BusquedaProvider } from './../providers/BusquedaUsers/BusquedaProvider';
import ExpedienteProvider from "./../feature/expedientes/context/ExpedienteProvider";

// "permiso" usa los mismos Id_Recurso que el menú lateral. Sin "permiso" la ruta
// solo exige sesión (Configuración, Ayuda y la redirección de Gestión Laboral).
export const privateRoutes = [
    {
        path: "usuarios",
        permiso: RECURSO.REGISTRAR_USUARIO,
        element: (
            <BusquedaProvider>
                <Usuarios />
            </BusquedaProvider>
        )
    },
    { path: "permisos", permiso: RECURSO.ASIGNAR_PERMISOS, element: <Index /> },
    { path: "historial", permiso: RECURSO.HISTORIAL_ACTIVIDAD, element: <Bitacora /> },
    { path: "ubicacion", permiso: RECURSO.UBICACIONES_Y_UNIDADES, element: <Ubicacion /> },
    {
        path: "expedientes",
        permiso: RECURSO.CONSULTAR_EXPEDIENTES,
        element: (
            <BusquedaProvider>
                <Expedientes />
            </BusquedaProvider>
        )
    },
    {
        path: "crear-expediente",
        permiso: RECURSO.REGISTRAR_EXPEDIENTE,
        element: (
            <ExpedienteProvider>
                <CrearExpediente />
            </ExpedienteProvider>
        )
    },
    {
        path: "editar-expediente/:id",
        permiso: RECURSO.ACTUALIZAR_EXPEDIENTE,
        element: (
            <ExpedienteProvider>
                <EditarExpediente />
            </ExpedienteProvider>
        )
    },
    { path: "info-personal/:id", permiso: RECURSO.CONSULTAR_EXPEDIENTES, element: <DetalleExpediente /> },
    { path: "caracteristicas-fisicas/:id", permiso: RECURSO.CONSULTAR_EXPEDIENTES, element: <DetalleExpediente /> },
    { path: "info-familiar/:id", permiso: RECURSO.CONSULTAR_EXPEDIENTES, element: <DetalleExpediente /> },
    { path: "info-laboral/:id", permiso: RECURSO.CONSULTAR_EXPEDIENTES, element: <DetalleExpediente /> },
    { path: "info-salarial/:id", permiso: RECURSO.CONSULTAR_EXPEDIENTES, element: <DetalleExpediente /> },
    { path: "info-academica/:id", permiso: RECURSO.CONSULTAR_EXPEDIENTES, element: <DetalleExpediente /> },
    { path: "documentos/:id", permiso: RECURSO.CONSULTAR_EXPEDIENTES, element: <DetalleExpediente /> },
    { path: "busqueda-rapida", permiso: RECURSO.BUSQUEDA_RAPIDA, element: <BusquedaRapida /> },
    { path: "gestion-documentos", permiso: RECURSO.DOCUMENTOS_EXPEDIENTE, element: <GestionDocumentos /> },
    { path: "gestion-laboral", element: <Navigate to="plazas" replace /> },
    { path: "plazas", permiso: RECURSO.PLAZAS_Y_CARGOS, element: <Plazas /> },
    { path: "movimientos", permiso: RECURSO.MOVIMIENTOS_Y_RECORRIDO, element: <Movimientos /> },
    { path: "deducciones", permiso: RECURSO.DEDUCCIONES, element: <Deducciones /> },
    { path: "instituciones", permiso: RECURSO.INSTITUCIONES_ACADEMICAS, element: <InstitucionesAcademicas /> },
    { path: "consulta-academica", permiso: RECURSO.FORMACION_ACADEMICA, element: <ConsultaAcademica /> },
    { path: "estadisticas", permiso: RECURSO.PANEL_INDICADORES, element: <Dashboard /> },
    {
        path: "reportes",
        permiso: [RECURSO.FUERZA_LABORAL, RECURSO.ALTAS_Y_BAJAS, RECURSO.PANEL_INDICADORES],
        element: <Reportes />
    },
    { path: "herramientas-ayuda", element: <HerramientasAyuda /> },
    { path: "catalogos-ubicaciones", permiso: RECURSO.UBICACIONES_Y_UNIDADES, element: <Ubicacion /> },
    { path: "configuracion", element: <Configuracion /> },
    { path: "*", element: <Navigate to="/index" replace /> }
];
