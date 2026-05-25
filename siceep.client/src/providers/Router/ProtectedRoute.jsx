import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./../Authenticacion/useAuth";
import Index from "../../shared/layouts/Index.jsx";
export default function ProtectedRoute() {

    const { autenticado } = useAuth();

    return autenticado
        ? <Index />
        : <Navigate to="/" replace />;
}
