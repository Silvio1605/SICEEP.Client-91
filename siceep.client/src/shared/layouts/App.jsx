import { Routes, Route } from "react-router-dom";
import Usuarios from './../../feature/usuarios/pages/Usuarios.jsx';
import { BusquedaProvider } from './../../providers/BusquedaUsers/BusquedaProvider.jsx';
import Permisos from './../../feature/permisos/pages/Permisos.jsx';
import Home from "./Home.jsx";
import Index from "./Index.jsx";
import Login from './../../feature/auth/pages/Login.jsx';

function App() {
  return (
      <Routes>

          {/* Login independiente */}
          <Route path="/" element={<Login />} />

          {/* Layout principal */}
          <Route path="/home" element={<Index />}>

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

      </Routes>
  )
}

export default App;
