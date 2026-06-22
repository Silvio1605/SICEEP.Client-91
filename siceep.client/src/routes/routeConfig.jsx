import Usuarios from "../feature/usuarios/pages/usuarios";
import Index from "../feature/permisos/pages/index";
import Bitacora from "../feature/bitacora/page/bitacora";
import Ubicacion from "../feature/ubicacion/page/ubicacion";
import { BusquedaProvider } from './../providers/BusquedaUsers/BusquedaProvider.jsx';

export const privateRoutes = [
    {
        path: "usuarios",
        element: <BusquedaProvider>
                    <Usuarios />
                 </BusquedaProvider>
    },
    {
        path: "permiso",
        element: <Index />
    },
    {
        path: "historial",
        element: <Bitacora />
    },
    {
        path: "ubicacion",
        element: <Ubicacion />
    },
];
