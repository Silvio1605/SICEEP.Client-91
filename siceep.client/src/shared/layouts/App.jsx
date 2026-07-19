import { Routes, Route } from "react-router-dom";
import { BusquedaProvider } from './../../providers/BusquedaUsers/BusquedaProvider.jsx';
//import ProtectedRoute from "../../providers/Router/ProtectedRoute.jsx";
import Index from "./Index.jsx";
import Login from './../../feature/auth/pages/Login.jsx';
import { privateRoutes } from "../../routes/routeConfig.jsx";

function App() {
    return (
        <Routes>
            {/* Login independiente */}
            <Route path="/" element={<Login />} />

            {/* Layout principal */}
            <Route /*element={<ProtectedRoute />}*/>
                <Route path="/index" element={<Index />}>

                    {/* Ruta de bienvenida perfectamente centrada con Flexbox */}
                    <Route index element={
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "75vh",
                            color: "#004080"
                        }}>
                            <h2 style={{ fontSize: "2rem", fontWeight: "bold", margin: "0 0 10px 0" }}>
                                ¡Bienvenido a SeguraNica S.A.!
                            </h2>
                            <p style={{ fontSize: "1.2rem", color: "#555", margin: 0 }}>
                                Selecciona una opción en el menú izquierdo para comenzar.
                            </p>
                        </div>
                    } />

                    {/* Limpiador de rutas hijas */}
                    {privateRoutes.map((route) => {
                        const rutaLimpia = route.path.startsWith("/")
                            ? route.path.substring(1)
                            : route.path;

                        return (
                            <Route
                                key={route.path}
                                path={rutaLimpia}
                                element={route.element}
                            />
                        );
                    })}
                </Route>
            </Route>
        </Routes>
    )
}

export default App;