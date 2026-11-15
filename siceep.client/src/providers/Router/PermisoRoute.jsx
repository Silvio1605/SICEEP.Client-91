import { Navigate } from "react-router-dom";
import { useAuth } from "./../Authenticacion/useAuth";

export default function PermisoRoute({ idPermiso, children }) {

    const { tienePermiso } = useAuth();

    return tienePermiso(idPermiso)
        ? children
        : <Navigate to="/index" replace />;
}
