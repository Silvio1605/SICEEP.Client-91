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
                    {privateRoutes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={route.element}
                        />
                    ))}
                </Route>
            </Route>
        </Routes>
    )
}

export default App;
