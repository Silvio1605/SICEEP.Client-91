import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "./../Authenticacion/useAuth";

export default function ProtectedRoute() {

    const { autenticado, loading } = useAuth();

    // Mientras /Auth/Me valida el token, no redirigir (evita "sacarlo" al recargar)
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return autenticado
        ? <Outlet />
        : <Navigate to="/" replace />;
}