import Usuarios from "../feature/usuarios/pages/usuarios";
import Index from "../feature/permisos/pages/index";
import Bitacora from "../feature/bitacora/page/bitacora";
import Ubicacion from "../feature/ubicacion/page/ubicacion";
import { BusquedaProvider } from './../providers/BusquedaUsers/BusquedaProvider';
import Expedientes from "../feature/expedientes/pages/Expedientes";
import DetalleExpediente from "../feature/expedientes/pages/DetalleExpediente";
import CrearExpediente from "../feature/expedientes/pages/CrearExpediente";
import GestionDeducciones from "../feature/tramites/pages/GestionDeducciones";
import BusquedaRapida from "../feature/tramites/pages/BusquedaRapida";

export const privateRoutes = [
    {
        path: "usuarios",
        element: (
            <BusquedaProvider>
                <Usuarios />
            </BusquedaProvider>
        )
    },
    { path: "permisos", element: <Index /> },
    { path: "historial", element: <Bitacora /> },
    { path: "ubicacion", element: <Ubicacion /> },
    {
        path: "expedientes",
        element: (
            <BusquedaProvider>
                <Expedientes />
            </BusquedaProvider>
        )
    },
    { path: "crear-expediente", element: <CrearExpediente /> },
    { path: "info-personal/:id", element: <DetalleExpediente /> },
    { path: "info-familiar/:id", element: <DetalleExpediente /> },
    { path: "info-laboral/:id", element: <DetalleExpediente /> },
    { path: "info-academica/:id", element: <DetalleExpediente /> },
    { path: "deducciones", element: <GestionDeducciones /> },
    { path: "busqueda-rapida", element: <BusquedaRapida /> }
];