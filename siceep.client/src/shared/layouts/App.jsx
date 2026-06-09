import { Routes, Route } from "react-router-dom";
import Usuarios from './../../feature/usuarios/pages/Usuarios.jsx';
import { BusquedaProvider } from './../../providers/BusquedaUsers/BusquedaProvider.jsx';
import Permisos from './../../feature/permisos/pages/Permisos.jsx';
import Index from "./Index.jsx";
import Login from './../../feature/auth/pages/Login.jsx';
import ProtectedRoute from "../../providers/Router/ProtectedRoute.jsx";

function App() {
  return (
      <Routes>
          {/* Login independiente */}
          <Route path="/" element={<Login />} />

          {/* Layout principal */}
          <Route element={<ProtectedRoute />}>
              <Route path="/index" element={<Index />}>
                  <Route
                      path="usuarios"
                      element={
                          <BusquedaProvider>
                              <Usuarios />
                          </BusquedaProvider>
                      }
                  />
                  <Route
                      path="permiso"
                      element={<Permisos />}
                  /> 
              </Route>
          </Route>
      </Routes>
  )
}

export default App;
