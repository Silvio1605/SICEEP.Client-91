import Usuarios from "../feature/usuarios/pages/usuarios";
import Index from "../feature/permisos/pages/index";
import Bitacora from "../feature/bitacora/page/bitacora";
import Ubicacion from "../feature/ubicacion/page/ubicacion";
import { BusquedaProvider } from './../providers/BusquedaUsers/BusquedaProvider';
import Expedientes from "../feature/expedientes/pages/Expedientes";
import DetalleExpediente from "../feature/expedientes/pages/DetalleExpediente";

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
<<<<<<< HEAD
    {
        path: "historial",
        element: <Bitacora />
    },
    {
        path: "ubicacion",
        element: <Ubicacion />
    }
];
=======

    { path: "info-personal/:id", element: <DetalleExpediente /> },
    { path: "info-familiar/:id", element: <DetalleExpediente /> },
    { path: "info-laboral/:id", element: <DetalleExpediente /> },
    { path: "info-academica/:id", element: <DetalleExpediente /> }
];
>>>>>>> oscarDev
